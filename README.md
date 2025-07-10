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
2. Upload the included `example_dynamic_warnings.manifest.json` file (located in the webapp folder)
3. Click "Validate Schema" to see the enhanced warnings
4. Click "View Details" on any Dynamic type warning to see the expanded information

### Alternative Test File
You can also use the `quick_test_dynamic.manifest.json` file in the root directory for a simpler test case.

## ⚙️ Deployment

This enhanced version is deployed to Azure Static Web Apps with:
- **GitHub Actions CI/CD** for automatic deployments
- **Custom domain support** 
- **Global CDN distribution**
- **HTTPS by default**

## 🚀 Getting Started

### Quick Start
1. Visit the live application: https://happy-water-01a48df10.2.azurestaticapps.net
2. Upload a manifest file (use the example files to test)
3. Click "Validate Schema" to see validation results
4. Explore the enhanced Dynamic type warnings with interactive "View Details" buttons

### Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/osalzberg/LASchemaValidator-Enhanced.git
   cd LASchemaValidator-Enhanced
   ```

2. **Run locally**:
   ```bash
   cd webapp
   python start_server.py
   ```
   Then visit http://localhost:8000

## 📁 Project Structure

```text
├── webapp/
│   ├── index.html                           # Main application
│   ├── script.js                           # Enhanced validation logic
│   ├── style.css                           # Enhanced styling
│   ├── example_dynamic_warnings.manifest.json # Test file with Dynamic types
│   └── staticwebapp.config.json            # Azure Static Web App config
├── quick_test_dynamic.manifest.json        # Simple test file
├── README.md                               # This file
├── MIGRATION_COMPLETE.md                   # Migration summary
└── .github/workflows/                      # GitHub Actions CI/CD
    └── azure-static-web-apps-*.yml
```

## 🎯 Features in Detail

### Enhanced Dynamic Type Detection
- Automatically scans manifest files for `dynamic` type columns
- Provides performance impact warnings
- Suggests specific alternative data types
- Offers best practice recommendations

### Interactive Warning System
- Expandable warning cards with detailed information
- Visual indicators using orange warning styling
- Clickable "View Details" buttons for comprehensive guidance
- Performance optimization suggestions

## 🌐 Live Application

The enhanced validator is available at:
**https://happy-water-01a48df10.2.azurestaticapps.net**

## 📄 License

MIT License
