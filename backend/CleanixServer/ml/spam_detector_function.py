import re
import tldextract
import joblib
from scipy.sparse import hstack
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # points to your ml/ folder



def extract_urls(text):
    url_pattern = r'\b(?:https?://|www\.)\S+\b'
    return re.findall(url_pattern, text)

def convert_for_prediction(_from,cc,subject,body):
    urls=extract_urls(body)
    has_url=1 if len(urls)>0 else 0
    num_urls=len(urls)

    num_cc=len(cc)

    sender_domain = _from.split("@")[-1] if "@" in _from else ""

    data_dict = {
        "From": _from,
        "Subject": subject,
        "Body": body,
        "URLs": urls,
        "SenderDomain": sender_domain,
        "HasURL": has_url,
        "NumURLs": num_urls,
        "NumCC": num_cc,
    }

    return data_dict

def get_url_dictionary(url_list):
    url_dicts=[]

    for url in url_list:
        extracted=tldextract.extract(url)
        domain=extracted.domain
        sub_domain=extracted.subdomain
        tld=extracted.suffix
        path=url.split(f"{domain}.{tld}")[-1] if domain and tld else ""

        url_info={
            "URL": url,
            "Domain": domain,
            "Subdomain": sub_domain,
            "TLD": tld,
            "Path": path,
            "Length": len(url),
            "NumSpecialChars": sum(1 for c in url if not c.isalnum())
        }

        url_dicts.append(url_info)
        
    return url_dicts

def predict_the_mail(data_dict):
    #for the email
    email_model = joblib.load(os.path.join(BASE_DIR, "email_model.pkl"))
    body_vectorizer = joblib.load(os.path.join(BASE_DIR, "body_vectorizer.pkl"))
    domain_vectorizer = joblib.load(os.path.join(BASE_DIR, "domain_vectorizer.pkl"))
    from_vectorizer = joblib.load(os.path.join(BASE_DIR, "from_vectorizer.pkl"))
    sub_vectorizer = joblib.load(os.path.join(BASE_DIR, "sub_vectorizer.pkl"))
    email_scaler = joblib.load(os.path.join(BASE_DIR, "email_scaler.pkl"))


    x_from=from_vectorizer.transform([data_dict["From"]])
    x_sub=sub_vectorizer.transform([data_dict["Subject"]])
    x_domain=domain_vectorizer.transform([data_dict["SenderDomain"]])
    x_body=body_vectorizer.transform([data_dict["Body"]])

    numeric_features = [[data_dict['NumURLs'],data_dict['NumCC']]]
    has_url=[[data_dict["HasURL"]]]
    x_numeric=email_scaler.transform(numeric_features)

    x = hstack([x_from, x_sub, x_body, x_domain, x_numeric,has_url])
    result=email_model.predict(x)

    if result==1:
        return True
    else:
        return False

def predict_the_url(url_dict):
    #for url
    url_model = joblib.load(os.path.join(BASE_DIR, "url_model.pkl"))
    url_path_vectorizer = joblib.load(os.path.join(BASE_DIR, "url_path_vectorizer.pkl"))
    url_domain_vectorizer = joblib.load(os.path.join(BASE_DIR, "url_domain_vectorizer.pkl"))
    url_TLD_vectorizer = joblib.load(os.path.join(BASE_DIR, "url_TLD_vectorizer.pkl"))
    url_subDomain_vectorizer = joblib.load(os.path.join(BASE_DIR, "url_subDomain_vectorizer.pkl"))
    URL_vectorizer = joblib.load(os.path.join(BASE_DIR, "URL_vectorizer.pkl"))
    url_scaler = joblib.load(os.path.join(BASE_DIR, "url_scaler.pkl"))

    x_URL=URL_vectorizer.transform([url_dict["URL"]])
    x_dom=url_domain_vectorizer.transform([url_dict["Domain"]])
    x_subDom=url_subDomain_vectorizer.transform([url_dict["Subdomain"]])
    x_TLD=url_TLD_vectorizer.transform([url_dict["TLD"]])
    x_path=url_path_vectorizer.transform([url_dict["Path"]])

    numeric_features = [[url_dict['Length'],url_dict['NumSpecialChars']]]
    x_numeric=url_scaler.transform(numeric_features)

    x = hstack([x_URL, x_dom, x_subDom, x_TLD,x_path, x_numeric])
    result=url_model.predict(x)

    if result==1:
        return True
    else:
        return False

def predict_by_message(message):
    model=joblib.load(os.path.join(BASE_DIR,"rf_model.pkl"))
    vectorizer=joblib.load(os.path.join(BASE_DIR,"tfidf_vectorizer.pkl"))

    if isinstance(message, str):
        message = [message]
    
    message_transformed = vectorizer.transform(message)
    result=model.predict(message_transformed)

    if result[0]==1:
        return False
    else:
        return True

def combined_spam_result(_from,cc,subject,message):
    data_dict=convert_for_prediction(_from,cc,subject,message)
    url_list=get_url_dictionary(data_dict["URLs"])

    first_analysis=predict_the_mail(data_dict)

    second_analysis=False

    if url_list:
        for url_dict in url_list:
            temp_analysis=predict_the_url(url_dict)
            if temp_analysis==True:
                second_analysis=True
                break

    third_analysis=predict_by_message(message)
    #if either one of them predicts spam
    if(first_analysis or second_analysis or third_analysis):
        return True
    else:
        return False

