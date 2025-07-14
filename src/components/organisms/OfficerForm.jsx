import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import { officerService } from "@/services/api/officerService";

const OfficerForm = ({ officer, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: officer?.name || "",
    badgeNumber: officer?.badgeNumber || "",
    branch: officer?.branch || "",
    office: officer?.office || "",
    organization: officer?.organization || "",
    state: officer?.state || "",
    email: officer?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const australianStates = [
    { value: "NSW", label: "New South Wales" },
    { value: "VIC", label: "Victoria" },
    { value: "QLD", label: "Queensland" },
    { value: "WA", label: "Western Australia" },
    { value: "SA", label: "South Australia" },
    { value: "TAS", label: "Tasmania" },
    { value: "ACT", label: "Australian Capital Territory" },
    { value: "NT", label: "Northern Territory" },
  ];

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
      newErrors.name = "Name is required";
    }
    
    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }
    
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
      if (officer?.Id) {
        await officerService.update(officer.Id, formData);
        toast.success("Officer updated successfully!");
      } else {
        await officerService.create(formData);
        toast.success("Officer created successfully!");
      }
      
      onSuccess();
    } catch (error) {
      toast.error("An error occurred while saving the officer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          required
        />
        
        <FormField
          label="Badge Number"
          name="badgeNumber"
          value={formData.badgeNumber}
          onChange={handleInputChange}
          error={errors.badgeNumber}
        />
        
        <FormField
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleInputChange}
          error={errors.branch}
        />
        
        <FormField
          label="Office"
          name="office"
          value={formData.office}
          onChange={handleInputChange}
          error={errors.office}
        />
        
        <FormField
          label="Organization"
          name="organization"
          value={formData.organization}
          onChange={handleInputChange}
          error={errors.organization}
          required
        />
        
        <FormField
          label="State"
          error={errors.state}
          required
        >
          <Select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a state</option>
            {australianStates.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </Select>
        </FormField>
        
        <div className="md:col-span-2">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2"
        >
          {loading ? "Saving..." : officer?.Id ? "Update Officer" : "Create Officer"}
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

export default OfficerForm;