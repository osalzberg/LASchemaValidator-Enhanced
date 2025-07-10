# Enhanced Azure Log Analytics Schema Validator

**🌟 Live Demo: https://happy-water-01a48df10.2.azurestaticapps.net**

## 🎯 Enhanced Features

### 🔥 NEW: Dynamic Type Warning System
- **Smart Detection**: Automatically identifies columns with `dynamic` type in Log Analytics table schemas
- **Interactive UI**: Click "View Details" button to expand detailed information about dynamic type issues
- **Performance Guidance**: Provides specific recommendations for optimizing dynamic type usage
- **Visual Indicators**: Orange warning styling to highlight schema concerns

### 🎯 NEW: Interactive Warning Cards
- **Expandable Details**: Each dynamic type warning includes a collapsible details section
- **Best Practice Recommendations**: Specific guidance on addressing dynamic type concerns
- **Alternative Type Suggestions**: Recommended specific data types for better performance
- **Enhanced Styling**: Distinct visual treatment for better user experience

## 🚀 Core Features

A comprehensive solution for Azure Log Analytics schema onboarding that combines a powerful web application for schema validation with enhanced dynamic type detection and interactive guidance.

### Web Application (Primary Feature)
- **Schema Validation**: Complete validation of Azure Log Analytics onboarding packages
- **NGSchema Support**: Specialized for the modern NGSchema (dedicated schema) format
- **Interactive Guide**: Comprehensive onboarding documentation and best practices
- **Real-time Feedback**: Instant validation results with detailed error messages
- **Drag & Drop Interface**: Easy file upload and folder structure validation
- **Enhanced Dynamic Type Warnings**: NEW - Interactive warnings for dynamic type columns

## 🧪 Testing Dynamic Type Warnings

To test the enhanced Dynamic type warning functionality:

1. Visit the live application: https://happy-water-01a48df10.2.azurestaticapps.net
2. Upload the included `test_dynamic_with_warnings.manifest.json` file
3. Click "Validate Schema" to see the enhanced warnings
4. Click "View Details" on any Dynamic type warning to see the expanded information

## ⚙️ Deployment

This enhanced version is deployed to Azure Static Web Apps with:
- **GitHub Actions CI/CD** for automatic deployments
- **Custom domain support** 
- **Global CDN distribution**
- **HTTPS by default**

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
