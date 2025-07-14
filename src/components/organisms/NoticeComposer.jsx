import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import ApperIcon from "@/components/ApperIcon";
import { officerService } from "@/services/api/officerService";
import { templateService } from "@/services/api/templateService";
import { noticeService } from "@/services/api/noticeService";

const NoticeComposer = ({ onSuccess }) => {
  const [officers, setOfficers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [officersData, templatesData] = await Promise.all([
        officerService.getAll(),
        templateService.getAll()
      ]);
      setOfficers(officersData);
      setTemplates(templatesData);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleOfficerSelect = (officerId) => {
    const officer = officers.find(o => o.Id === parseInt(officerId));
    setSelectedOfficer(officer);
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.Id === parseInt(templateId));
    setSelectedTemplate(template);
    
    if (template) {
      setCustomSubject(populateTemplate(template.subject, selectedOfficer));
      setCustomBody(populateTemplate(template.body, selectedOfficer));
    }
  };

  const populateTemplate = (text, officer) => {
    if (!officer || !text) return text;
    
    const variables = {
      "officer.name": officer.name,
      "officer.organization": officer.organization,
      "officer.state": officer.state,
      "officer.branch": officer.branch || "",
      "officer.office": officer.office || "",
      "officer.badgeNumber": officer.badgeNumber || "",
      "sender.name": "Living Council Member",
      "notice.date": new Date().toLocaleDateString(),
    };
    
    let populatedText = text;
    Object.entries(variables).forEach(([key, value]) => {
      populatedText = populatedText.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    
    return populatedText;
  };

  const handleSend = async () => {
    if (!selectedOfficer || !customSubject || !customBody) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const noticeData = {
        recipientId: selectedOfficer.Id,
        templateId: selectedTemplate?.Id,
        subject: customSubject,
        body: customBody,
        sentBy: "Current User",
        organization: selectedOfficer.organization,
        state: selectedOfficer.state,
      };

      await noticeService.create(noticeData);
      
      // Create mailto link
      const mailtoLink = `mailto:${selectedOfficer.email}?subject=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`;
      window.location.href = mailtoLink;
      
      toast.success("Notice sent successfully!");
      onSuccess?.();
      
      // Reset form
      setStep(1);
      setSelectedOfficer(null);
      setSelectedTemplate(null);
      setCustomSubject("");
      setCustomBody("");
    } catch (error) {
      toast.error("Failed to send notice");
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = selectedOfficer;
  const canProceedToStep3 = selectedOfficer && selectedTemplate;
  const canSend = selectedOfficer && customSubject && customBody;

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-navy-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-navy-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-navy-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-navy-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-navy-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Step {step} of 3
        </div>
      </div>

      {/* Step 1: Select Officer */}
      {step === 1 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Select Recipient</h3>
          <FormField label="Public Officer">
            <Select
              value={selectedOfficer?.Id || ""}
              onChange={(e) => handleOfficerSelect(e.target.value)}
            >
              <option value="">Select an officer</option>
              {officers.map(officer => (
                <option key={officer.Id} value={officer.Id}>
                  {officer.name} - {officer.organization}
                </option>
              ))}
            </Select>
          </FormField>
          
          {selectedOfficer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Selected Officer:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Name:</strong> {selectedOfficer.name}</div>
                <div><strong>Organization:</strong> {selectedOfficer.organization}</div>
                <div><strong>State:</strong> {selectedOfficer.state}</div>
                <div><strong>Email:</strong> {selectedOfficer.email}</div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedToStep2}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ApperIcon name="ArrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Select Template */}
      {step === 2 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Select Template</h3>
          <FormField label="Notice Template">
            <Select
              value={selectedTemplate?.Id || ""}
              onChange={(e) => handleTemplateSelect(e.target.value)}
            >
              <option value="">Select a template</option>
              {templates.map(template => (
                <option key={template.Id} value={template.Id}>
                  {template.name}
                </option>
              ))}
            </Select>
          </FormField>
          
          {selectedTemplate && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Template Preview:</h4>
              <div className="text-sm">
                <div className="mb-2"><strong>Subject:</strong> {selectedTemplate.subject}</div>
                <div><strong>Body:</strong> {selectedTemplate.body.substring(0, 200)}...</div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!canProceedToStep3}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ApperIcon name="ArrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Review and Send */}
      {step === 3 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Review and Send</h3>
          
          <div className="space-y-4">
            <FormField label="Subject">
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </FormField>
            
            <FormField label="Body">
              <TextArea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={10}
                className="w-full"
              />
            </FormField>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              onClick={handleSend}
              disabled={!canSend || loading}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Send" className="h-4 w-4" />
              <span>{loading ? "Sending..." : "Send Notice"}</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NoticeComposer;