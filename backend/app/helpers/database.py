from fastapi import HTTPException

def check_if_key_exists(key, value, document, collection):
    if key and key == "_id":
        value = value.strip("\"")
        try:
            value = value
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Bad value error {document} {value}")
    else:
        return None
    try:
        item = collection.find_one({key: value})
    except ValueError:
        raise HTTPException(status_code=500, detail = f"Internal server error")

    if not item:
        raise HTTPException(status_code=400, detail = f"{document} with id {value} does not exist")
    else:
        # print(item)
        return item