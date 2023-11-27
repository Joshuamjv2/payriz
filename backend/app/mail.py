from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from .config import settings
from jinja2 import Environment, select_autoescape, PackageLoader

env = Environment(
    loader=PackageLoader('app', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

class Email:
    def __init__(self, data: dict):
        self.sender = 'Payriz <payriz24@gmail.com>'
        self.email = data["email"]
        self.url = data.get("url")
        self.invoice_url = data.get("invoice_url")
        self.intro = data["intro"]
        self.message = data["message"]
        self.alt_message = data.get("alt_message")
        self.button = data.get("btn_message")
        self.subject = data["subject"]
        self.template = data["template"]
        self.first_name = data.get("first_name")
        self.last_name = data.get("last_name")
        self.phone = data.get("phone")
        self.sender_email = data.get("sender_email")

    async def sendMail(self):
        # Define the config
        conf = ConnectionConfig(
            MAIL_USERNAME=settings.EMAIL_HOST_USER,
            MAIL_PASSWORD=settings.EMAIL_HOST_PASSWORD,
            MAIL_FROM=settings.EMAIL_HOST_USER,
            MAIL_PORT=settings.EMAIL_PORT,
            MAIL_SERVER=settings.EMAIL_HOST,
            MAIL_STARTTLS = True,
            MAIL_SSL_TLS = False,
            USE_CREDENTIALS = True,
            VALIDATE_CERTS = True
        )
        # Generate the HTML template base on the template name
        template = env.get_template(f'{self.template}')

        html = template.render(
            url=self.url,
            message=self.message,
            subject=self.subject,
            intro = self.intro,
            alt_message = self.alt_message,
            btn_message = self.button,
            invoice_url = self.invoice_url,
            first_name = self.first_name,
            last_name = self.last_name,
            phone = self.phone,
            sender_email = self.sender_email
        )

        # Define the message options
        message = MessageSchema(
            subject=self.subject,
            recipients=[self.email],
            body=html,
            subtype="html"
        )

        # Send the email
        fm = FastMail(conf)
        await fm.send_message(message)

    async def sendVerificationToken(self):
        await self.sendMail()
