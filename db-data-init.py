import pytesseract
import fitz
from pdf2image import convert_from_path
from pinecone import Pinecone
import openai
from dotenv import load_dotenv
load_dotenv()
import os
from supabase import create_client, Client
import glob
import numpy as np
from retrying import retry
import json

#initialize supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_API_KEY")
supabase: Client = create_client(url, key)

#initialize openai
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

#initialize pytesseract for OCR
pytesseract.pytesseract.tesseract_cmd = r"C:\Users\evillaramirez\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

#initiliaze pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("product-content")

def get_chunks_with_overlap(text, chunk_size=1000, overlap_size=100):
    chunks = []
    words = text.split()  # Split text into words

    current_chunk = words[0] + " "  # Initialize the first chunk with the first word
    chunk_length = len(current_chunk)

    for word in words[1:]:
        if chunk_length + len(word) + overlap_size <= chunk_size:  # Check if adding the word keeps the chunk within size limit with overlap
            current_chunk += word + " "  # Add word to current chunk with a space
            chunk_length += len(word) + 1  # Update chunk length
        else:
            chunks.append(current_chunk.strip())  # Add current chunk to chunks list
            current_chunk = current_chunk[-overlap_size:] + word + " "  # Start a new chunk with overlap
            chunk_length = len(current_chunk)

    if current_chunk:  # Append the remaining chunk
        chunks.append(current_chunk.strip())

    return chunks


def extract_text_from_pdf(doc):
    full_text = '' # create a variable to store the full text
    for page in doc: # iterate the document pages
        text = page.get_text().encode("utf8") # get plain text (is in UTF-8)
        full_text += text.decode("utf-8") # append text of page to full text

    #if text is less than 100 characters, it is not a valid text
    if len(full_text) < 100:
        return None
    
    return full_text

def extract_text_with_ocr(doc):
    #convert pdf to image
    images = convert_from_path(pathName, poppler_path=r"C:\Users\evillaramirez\OneDrive - BarcodesInc (1)\Documents\development\poppler-24.02.0\Library\bin")

    #save full page images
    for i in range(len(images)):
        images[i].save('OCR-image-output/'+ filename + '-page'+ str(i) +'.jpg', 'JPEG')

    #extract text from full page images
    text = ''
    for i in range(len(images)):
        text += pytesseract.image_to_string(images[i])
    
    return text

@retry(wait_exponential_multiplier=1000, wait_exponential_max=10000, stop_max_attempt_number=3)
def get_embedding(text, filename):
    embedding_concat = "filename: " + filename + "\ntext: " + text
    embedding_response = openai.Embedding.create(
        model="text-embedding-3-large",
        input=embedding_concat
    )
    return embedding_response

def get_industry_challenge_mapping(text, file_id):
    max_retries = 3
    retries = 0
    needs_retry = True
    while retries < max_retries and needs_retry:
        try:
            mapping_response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0125",
                messages=[
                    {"role" : "system", "content" : "You are a marketing and solutions wizard. You are creating a mapping of challenges an industry faces to the solutions your company provides. Identify industries that this product applies to and identify topics of discussion for how the industry can improve a process (a process that this product can improve). These topics will be used as the theme for blogs, social media posts, etc. aimed to create leads for your business. The output should be a JSON in the following format:\n{industry_name: [{\"Discussion_Topic\": \"Description:\"}]}\n{industry_name: [{\"Discussion_Topic\": \"Description:\"}]} ,replace \"industry_name\" with the name of an industry (i.e. Healthcare, Retail, Warehousing, etc.), Discussion_Topic is the topic title, and Description is a description of the discussion topic." },
                    {"role" : "user", "content" : text}
                ],
                temperature=0.2
            )

            industry = None
            discussion_topic = None
            description = None

            if mapping_response.choices[0].message.content:
                print("Mapping response: ", mapping_response.choices[0].message.content)
                try:
                    parsed_data = json.loads(mapping_response.choices[0].message.content)
                    needs_retry = False
                except json.JSONDecodeError as e:
                    print("Needs Retry ##############################################")
                    print("Error parsing response data for file_id: ", file_id)
                    print("Response: ", mapping_response.choices[0].message.content)
                    print("Error: ", e)
                    retries += 1
                    needs_retry = True

                for industry, topics in parsed_data.items():
                    for item in topics:
                        if len(item) == 1:
                            discussion_topic = next(iter(item))
                            description = item[discussion_topic]
                        else:
                            if "Discussion_Topic" in item and "Description" in item:
                                discussion_topic = item["Discussion_Topic"]
                                description = item["Description"]
                            else:
                                print("Key error in response data for file_id: ", file_id)
                                print("Response: ", parsed_data)
                                for key, value in item.items():
                                    discussion_topic = key
                                    description = value
                                print("Using discussion_topic: ", discussion_topic)
                                print("Using description: ", description)
                        if industry is not None and discussion_topic is not None and description is not None:
                            res = supabase.table("industry_challenge_mapping").insert([{"industry_name": industry, "discussion_topic": discussion_topic, "topic_description": description, "source_file_id": file_id}]).execute()
                        else:
                            print("Error inserting response data for file_id: ", file_id)
                            print("Response: ", parsed_data)
        except Exception as e:
            print("Error getting industry challenge mapping for file_id: ", file_id)
            print("Error: ", e)         


#upload all files in testing-specs to supabase
allfiles = glob.glob("testing-specs/*.pdf")
for pathName in allfiles:
    filename = pathName.replace(".pdf", "").replace("testing-specs\\", "")
    outfilename = "text-output/" + filename + ".txt"

    with open(pathName, 'rb') as f:

        res = supabase.storage.from_("testing-specs").upload(file=f, path=filename + ".pdf", file_options={"content-type": "application/pdf", "CacheControl": "3600", "upsert": "true"})
        doc = fitz.open(pathName) # open a document

        #extract text from pdf
        full_text = extract_text_from_pdf(doc)
        if full_text is None:
            #extract text with OCR
            print("Extracting text with OCR")
            full_text = extract_text_with_ocr(doc)
        else:
            print("Extracting text from PDF")

        if full_text is not None:
            chunks = get_chunks_with_overlap(full_text)
            res = supabase.table("file").insert([{"filename": filename, "filepath": "testing-specs/"+filename+".pdf", "content": full_text}]).execute()
            if res.data:
                file_id = res.data[0]["id"]
            get_industry_challenge_mapping(full_text, file_id)
            for idx, chunk in enumerate(chunks, start=1):
                embedding_response = get_embedding(chunk, filename)
                if embedding_response.data:
                    embeds = np.array(embedding_response.data[0]["embedding"])
                    chunk_id = f"{file_id}-{idx}"
                    data_to_insert = [{"id": chunk_id, "values": embeds}]
                    index.upsert(vectors=data_to_insert)
        else:
            print("No text extracted")

        #empty array to store extracted images
        found_images = []

        #extract individual images from pdf
        for page_index in range(len(doc)): # iterate over pdf pages
            page = doc[page_index] # get the page
            image_list = page.get_images()

            for image_index, img in enumerate(image_list, start=1): # enumerate the image list
                xref = img[0] # get the XREF of the image
                pix = fitz.Pixmap(doc, xref) # create a Pixmap

                if pix.n - pix.alpha > 3: # CMYK: convert to RGB first
                    pix = fitz.Pixmap(fitz.csRGB, pix)

                pix.save('image-output/'+ "%s-page_%s-image_%s.png" % (filename, page_index, image_index)) # save the image as png
                found_images.append("%s-page_%s-image_%s.png" % (filename, page_index, image_index)) # append the image to the list
                supabase.storage.from_("extracted-images").upload("%s-page_%s-image_%s.png" % (filename, page_index, image_index), "image-output/"+ "%s-page_%s-image_%s.png" % (filename, page_index, image_index))
                pix = None

        image_ids = []
        for image in found_images:
            res = supabase.table("image").insert([{"source_file": file_id, "filename": image, "pathname": "extracted-images/"+image}]).execute()
            if res.data:
                image_ids.append(res.data[0]["id"])
        res = supabase.table("file").update({"extracted_imgs": image_ids}).eq("id", file_id).execute()
