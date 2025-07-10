# Azure Log Analytics Schema Validator - Web Application

A comprehensive web application for validating Azure Log Analytics schema onboarding packages. This tool helps resource providers ensure their schema files meet all Azure Log Analytics requirements before submission.

## Features

### 🔍 Comprehensive Validation
- **Manifest File Validation**: Complete checks of .manifest.json files based on official documentation
- **KQL File Validation**: Syntax validation for transforms, queries, and functions
- **Sample Data Validation**: JSON format and structure validation
- **Description Format Validation**: Ensures descriptions start with capital letters and end with periods
- **File Reference Validation**: Verifies all files are properly referenced

### 📋 Validation Rules (Updated)
The validator now follows the official Azure Log Analytics onboarding manifest documentation:

- **Required Fields**: Only `type`, `displayName`, `description`, `simplifiedSchemaVersion`, and `tables` are mandatory
- **Tables Array**: Must contain at least one table object
- **Functions Array**: **Optional** - can be empty or omitted entirely
- **Queries Array**: **Optional** - can be empty or omitted entirely
- **Schema Version**: Must be "3" for current manifest format
- **Table Requirements**: Each table must have required fields like `name`, `description`, `dataTypeId`, etc.

### 🎨 Modern User Interface
- Clean, professional design with Azure branding
- Responsive layout for desktop and mobile
- Drag-and-drop file upload
- Real-time validation progress
- Detailed results with expandable sections

### 📊 Detailed Reporting
- Overall validation status summary
- Individual file validation results
- Issue categorization (errors vs warnings)
- Specific line-by-line feedback

## How to Use

### 1. Open the Application
Simply open `index.html` in any modern web browser. No server setup required!

### 2. Choose Validation Type
Select what you want to validate:
- **Manifest File**: Single .manifest.json file
- **KQL Files**: Transform, query, or function files
- **Sample Data**: Input/output JSON sample files
- **Complete Package**: All files from your schema package

### 3. Upload Files
- **Drag & Drop**: Simply drag files from your file explorer
- **Browse**: Click "Choose Files" to select files manually
- **Multiple Files**: Upload multiple files at once for batch validation

### 4. Review Results
- View overall validation status
- Expand individual file results for detailed feedback
- Address any issues or warnings found
- Re-upload corrected files as needed

## File Structure Requirements

The validator expects files to follow the Azure Log Analytics NGSchema structure:

```
Content/
└── NGSchemas/
    └── MyTeamsFolder/
        ├── KQL/
        │   ├── Transforms/
        │   │   └── *.kql
        │   ├── Queries/
        │   │   └── *.kql
        │   └── Functions/
        │       └── *.kql
        ├── SampleInputRecords/
        │   └── *.json
        ├── SampleOutputRecords/
        │   └── *.json
        ├── [xyz].manifest.json
        └── owners.txt
```

## Validation Rules

### Manifest File (.manifest.json)
- Must be valid JSON format
- Required fields: `type`, `displayName`, `description`, `simplifiedSchemaVersion`, `tables`
- `simplifiedSchemaVersion` must be "3"
- All descriptions must start with capital letter and end with period
- Table names must be 45 characters or less
- Column types must be valid Azure Log Analytics types

### KQL Files (.kql)
- Must not be empty
- Should contain valid KQL syntax
- Common KQL keywords expected (let, datatable, extend, project, etc.)

### Sample Data Files (.json)
- Must be valid JSON format
- Must contain arrays of sample records
- Should not be empty

### Description Format
All descriptions throughout the manifest must:
- Start with a capital letter (A-Z)
- End with a period (.)
- Apply to: table descriptions, column descriptions, function descriptions, query descriptions

## Browser Compatibility

The application works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3.0, Font Awesome 6.4.0
- **Validation**: Client-side JavaScript with comprehensive rule engine

### File Processing
- All validation is performed client-side
- No files are uploaded to any server
- File content is processed entirely in the browser
- Supports files up to browser memory limits

### Security
- No server communication required
- All data stays on your local machine
- No external dependencies for core functionality

## Validation Examples

### ✅ Valid Description Examples
```json
{
  "description": "Entries from the Azure Activity log that provides insight into subscription-level events."
}
```

### ❌ Invalid Description Examples
```json
{
  "description": "entries from the azure activity log" // Missing capital, missing period
}
```

```json
{
  "description": "IP address of the user who performed the operation" // Missing period
}
```

### ✅ Valid Manifest Structure
```json
{
  "type": "Microsoft.Resources/AzureActivity",
  "displayName": "Azure Activity Log V2",
  "description": "Entries from the Azure Activity log that provides insight into any subscription events.",
  "simplifiedSchemaVersion": "3",
  "tables": [
    {
      "name": "AzureActivityV2",
      "description": "Azure activity logs.",
      "columns": [
        {
          "name": "TimeGenerated",
          "type": "DateTime",
          "description": "Timestamp when the event was generated."
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues

**"Invalid JSON format" Error**
- Check for missing commas, quotes, or brackets
- Use a JSON validator to verify syntax
- Ensure proper escaping of special characters

**"Description format" Errors**
- Verify all descriptions start with capital letters
- Ensure all descriptions end with periods
- Check table, column, function, and query descriptions

**"Missing required field" Errors**
- Review the manifest schema requirements
- Ensure all mandatory fields are present
- Check field spelling and capitalization

**"File type not recognized" Warning**
- Verify file extensions are correct (.manifest.json, .kql, .json)
- Check file naming conventions
- Ensure files are in expected locations

### Getting Help

If you encounter issues not covered here:
1. Check the validation results for specific error messages
2. Review the Azure Log Analytics onboarding documentation
3. Verify your files against the NGSchema examples
4. Contact the Azure Log Analytics team for support

## Updates and Maintenance

This validator is designed to match the current Azure Log Analytics schema requirements. As requirements evolve, the validation rules may be updated to reflect new standards and best practices.

---

**Note**: This is a client-side validation tool. While it catches most common issues, always verify your schema follows the complete Azure Log Analytics onboarding guidelines and test with the official validation pipeline.
Deployment test - Thu Jul 10 12:06:06 IDT 2025
