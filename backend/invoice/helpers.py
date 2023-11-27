import requests, json
import tempfile
import boto3



def create_invoice_pdf(data, customer_id):
    s3_client = boto3.client("s3",
        aws_access_key_id='AKIA6NRTU4BCVMXOBYES',
        aws_secret_access_key='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',
        region_name='ap-southeast-2'
    )

    owner_name = data["from"]
    to = data["to"]
    invoice_number = data["invoice_number"]

    data = {
        "currency": data["currency"],
        "from": owner_name,
        "to": to,
        "items": data["items"],
        "due_date": data["due_date"],
        "date": data["date"],
        "fields": {"tax": "%", "discounts": False, "shipping": False},
        "tax": data["tax"],
        "number": data["invoice_number"]
        }

    invoice_res = requests.post(f"https://invoice-generator.com", json=json.loads(json.dumps(data)), stream=True)

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
        temp_file.write(invoice_res.content)

        bucket_name = "payriz-invoices"
        file_name = f"payriz_invoice/{customer_id}/{invoice_number}.pdf"

        s3_client.upload_file(temp_file.name, bucket_name, file_name)
        temp_file.close()
        print(f"https://payriz-invoices.s3.ap-southeast-2.amazonaws.com/{file_name}")
    return f"https://payriz-invoices.s3.ap-southeast-2.amazonaws.com/{file_name}"
