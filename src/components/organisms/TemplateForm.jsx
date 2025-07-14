import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import TextArea from "@/components/atoms/TextArea";
import { templateService } from "@/services/api/templateService";

const TemplateForm = ({ template, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    subject: template?.subject || "",
    body: template?.body || "",
    category: template?.category || "fiduciary",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.body.trim()) {
      newErrors.body = "Body content is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const templateData = {
        ...formData,
        variables: extractVariables(formData.body),
        createdBy: "Current User", // In real app, get from auth context
      };

      if (template?.Id) {
        await templateService.update(template.Id, templateData);
        toast.success("Template updated successfully!");
      } else {
        await templateService.create(templateData);
        toast.success("Template created successfully!");
      }
      
      onSuccess();
    } catch (error) {
      toast.error("An error occurred while saving the template");
    } finally {
      setLoading(false);
    }
  };

  const extractVariables = (text) => {
    const variableRegex = /\{([^}]+)\}/g;
    const variables = [];
    let match;
    
    while ((match = variableRegex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  };

  const insertVariable = (variable) => {
    const textarea = document.querySelector('[name="body"]');
    const cursorPosition = textarea.selectionStart;
    const textBefore = formData.body.substring(0, cursorPosition);
    const textAfter = formData.body.substring(cursorPosition);
    
    setFormData(prev => ({
      ...prev,
      body: `${textBefore}{${variable}}${textAfter}`
    }));
  };

  const commonVariables = [
    "officer.name",
    "officer.organization",
    "officer.state",
    "officer.branch",
    "officer.office",
    "officer.badgeNumber",
    "sender.name",
    "notice.date",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Template Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        required
      />
      
      <FormField
        label="Subject Line"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
        error={errors.subject}
        required
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Variables
        </label>
        <div className="flex flex-wrap gap-2">
          {commonVariables.map(variable => (
            <Button
              key={variable}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertVariable(variable)}
              className="text-xs"
            >
              {`{${variable}}`}
            </Button>
          ))}
        </div>
      </div>
      
      <FormField
        label="Body Content"
        error={errors.body}
        required
      >
        <TextArea
          name="body"
          value={formData.body}
          onChange={handleInputChange}
          placeholder="Enter your notice template content here. Use {variable} syntax for dynamic content."
          rows={10}
          required
        />
      </FormField>

      <div className="flex items-center space-x-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2"
        >
          {loading ? "Saving..." : template?.Id ? "Update Template" : "Create Template"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;