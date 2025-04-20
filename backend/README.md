# AI Screening App Backend Setup

## Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone git@github.com:Abhijit1102/ai_screening_app.git

```

Navigate to the backend directory:

```bash
cd ai_screening_app/backend
```

Setting Up a Virtual Environment
For Windows
Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```
Your virtual environment should now be activated.

For Linux
Create a virtual environment:

```bash
python3 -m venv venv
```
Activate the virtual environment:

```bash
source venv/bin/activate
```

Your virtual environment should now be activated.

Install Dependencies
Once the virtual environment is activated, install the required dependencies using pip:

```bash
pip install -r requirements.txt
```

Set Up Environment Variables
Create a .env file in the backend directory and add the following variables:

```bash
MONGODB_URL=*****
OPENAI_API_KEY=*****
```

Replace the ***** with your actual MongoDB URL and OpenAI API Key.

Run the Backend
To start the backend server, use uvicorn:

```bash
uvicorn src.main:app --reload
```
This will start the backend server in development mode, and it will automatically reload the server on code