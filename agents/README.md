# Flask Backend README

# Flask React App Backend

This README provides information about the backend of the Flask React App project. The backend is built using Flask and integrates with various functionalities, including command execution, email management, and interaction with the Google GenAI client.

## Project Structure

```
flask-react-app
├── backend
│   ├── app.py
│   ├── main.py
│   ├── tools
│   │   ├── __init__.py
│   │   └── tools.py
│   ├── requirements.txt
│   └── README.md
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── App.js
│   │   ├── index.js
│   │   └── components
│   │       └── ExampleComponent.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd flask-react-app/backend
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Environment Variables**
   Ensure that you have the necessary environment variables set up, especially for the Google GenAI client.

5. **Run the Flask Application**
   ```bash
   python app.py
   ```

## Usage

The backend provides several endpoints that can be accessed by the React frontend. The main functionalities include:

- **Command Execution**: Execute system commands using the `run_command` tool.
- **Email Management**: Send and manage emails through the provided tools.
- **Integration with Google GenAI**: Utilize the GenAI client for various AI functionalities.

Refer to the `main.py` file for detailed information on the available tools and their usage.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.