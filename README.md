# Azure Log Analytics Schema Onboarding Agent

A comprehensive solution for Azure Log Analytics schema onboarding that combines a powerful web application for schema validation with an AI-powered command-line interface for guidance and support.

## 🚀 Features

### Web Application (Primary Feature)
- **Schema Validation**: Complete validation of Azure Log Analytics onboarding packages
- **NGSchema Support**: Specialized for the modern NGSchema (dedicated schema) format
- **Interactive Guide**: Comprehensive onboarding documentation and best practices
- **Real-time Feedback**: Instant validation results with detailed error messages
- **Drag & Drop Interface**: Easy file upload and folder structure validation

### AI Assistant (CLI)
- **Single Question Mode**: Ask one-off questions about Azure Log Analytics
- **Custom Prompt Mode**: Use specialized prompts for schema-related guidance
- **Interactive Chat**: Continuous conversation for complex onboarding scenarios
- **Configuration Testing**: Verify your Azure OpenAI setup

## Setup

1. **Clone and navigate to the project**:

   ```bash
   cd LASchemaOnboardingAgent
   ```

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Azure OpenAI**:

   ```bash
   cp .env.template .env
   # Edit .env with your Azure OpenAI credentials
   ```

4. **Test your configuration**:

   ```bash
   python main.py test
   ```

## Usage

### Ask a Single Question

```bash
python main.py ask --question "What is machine learning?"
```

### Use a Custom System Prompt

```bash
python main.py custom --prompt "You are a Python expert" --question "How do I use decorators?"
```

### Start Interactive Chat

```bash
python main.py chat
```

### Test Configuration

```bash
python main.py test
```

## Configuration

Create a `.env` file based on `.env.template` with your Azure OpenAI credentials:

```env
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
AZURE_OPENAI_KEY="your-api-key-here"
AZURE_OPENAI_DEPLOYMENT="gpt-35-turbo"
```

## Requirements

- Python 3.7+
- Azure OpenAI service access
- Required Python packages (see requirements.txt)

## Project Structure

```text
├── main.py                    # Main CLI application
├── .env.template             # Environment variables template
├── requirements.txt          # Python dependencies
├── README.md                # This file
└── .github/
    └── copilot-instructions.md  # Copilot development guidelines
```

## Development

This project uses:

- **Click** for CLI interface
- **Requests** for HTTP API calls
- **python-dotenv** for environment variable management

## License

MIT License
