import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import TemplateForm from "@/components/organisms/TemplateForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { templateService } from "@/services/api/templateService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    if (!searchTerm) {
      setFilteredTemplates(templates);
      return;
    }

    const filtered = templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTemplates(filtered);
  };

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setShowModal(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const handleDeleteTemplate = async (template) => {
    if (deleteConfirm === template.Id) {
      try {
        await templateService.delete(template.Id);
        toast.success("Template deleted successfully");
        loadTemplates();
        setDeleteConfirm(null);
      } catch (error) {
        toast.error("Failed to delete template");
      }
    } else {
      setDeleteConfirm(template.Id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const handleFormSuccess = () => {
    loadTemplates();
    handleModalClose();
  };

  if (loading) {
    return <Loading rows={4} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTemplates} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notice Templates</h1>
          <p className="text-gray-600 mt-1">
            Create and manage email templates for official notices
          </p>
        </div>
        <Button onClick={handleAddTemplate} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Template</span>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search templates..."
              onSearch={setSearchTerm}
              className="w-80"
            />
            <Badge variant="info">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <Empty
            icon="FileText"
            title="No templates found"
            message={searchTerm ? "No templates match your search criteria." : "Start by creating your first notice template."}
            actionLabel={!searchTerm ? "Add Template" : undefined}
            onAction={!searchTerm ? handleAddTemplate : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <Badge variant="default" className="mb-2">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={deleteConfirm === template.Id ? "danger" : "outline"}
                        size="sm"
                        onClick={() => handleDeleteTemplate(template)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
                      <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Body:</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {template.body.length > 100 
                          ? `${template.body.substring(0, 100)}...` 
                          : template.body
                        }
                      </p>
                    </div>
                    
                    {template.variables && template.variables.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.slice(0, 3).map((variable, i) => (
                            <Badge key={i} variant="info" className="text-xs">
                              {`{${variable}}`}
                            </Badge>
                          ))}
                          {template.variables.length > 3 && (
                            <Badge variant="info" className="text-xs">
                              +{template.variables.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>By {template.createdBy}</span>
                      <span>{format(new Date(template.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={selectedTemplate ? "Edit Template" : "Create New Template"}
        size="xl"
      >
        <TemplateForm
          template={selectedTemplate}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Templates;