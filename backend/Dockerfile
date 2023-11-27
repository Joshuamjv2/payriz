FROM public.ecr.aws/lambda/python:3.8
COPY ./ ./
COPY requirements.txt requirements.txt
RUN pip install -r ./requirements.txt
CMD ["main.handler"]