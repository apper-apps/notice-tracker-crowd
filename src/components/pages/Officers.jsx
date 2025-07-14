import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/molecules/Table";
import OfficerForm from "@/components/organisms/OfficerForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { officerService } from "@/services/api/officerService";
import { toast } from "react-toastify";

const Officers = () => {
  const [officers, setOfficers] = useState([]);
  const [filteredOfficers, setFilteredOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadOfficers();
  }, []);

  useEffect(() => {
    filterOfficers();
  }, [officers, searchTerm]);

  const loadOfficers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await officerService.getAll();
      setOfficers(data);
    } catch (err) {
      setError("Failed to load officers");
    } finally {
      setLoading(false);
    }
  };

  const filterOfficers = () => {
    if (!searchTerm) {
      setFilteredOfficers(officers);
      return;
    }

    const filtered = officers.filter(officer =>
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (officer.badgeNumber && officer.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOfficers(filtered);
  };

  const handleAddOfficer = () => {
    setSelectedOfficer(null);
    setShowModal(true);
  };

  const handleEditOfficer = (officer) => {
    setSelectedOfficer(officer);
    setShowModal(true);
  };

  const handleDeleteOfficer = async (officer) => {
    if (deleteConfirm === officer.Id) {
      try {
        await officerService.delete(officer.Id);
        toast.success("Officer deleted successfully");
        loadOfficers();
        setDeleteConfirm(null);
      } catch (error) {
        toast.error("Failed to delete officer");
      }
    } else {
      setDeleteConfirm(officer.Id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedOfficer(null);
  };

  const handleFormSuccess = () => {
    loadOfficers();
    handleModalClose();
  };

  if (loading) {
    return <Loading rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadOfficers} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Public Officers</h1>
          <p className="text-gray-600 mt-1">
            Manage public officer information and contacts
          </p>
        </div>
        <Button onClick={handleAddOfficer} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Officer</span>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search officers..."
              onSearch={setSearchTerm}
              className="w-80"
            />
            <Badge variant="info">
              {filteredOfficers.length} officer{filteredOfficers.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {filteredOfficers.length === 0 ? (
          <Empty
            icon="Users"
            title="No officers found"
            message={searchTerm ? "No officers match your search criteria." : "Start by adding your first public officer."}
            actionLabel={!searchTerm ? "Add Officer" : undefined}
            onAction={!searchTerm ? handleAddOfficer : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Badge Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficers.map((officer, index) => (
                  <motion.tr
                    key={officer.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{officer.name}</div>
                        {officer.office && (
                          <div className="text-sm text-gray-500">{officer.office}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-gray-900">{officer.organization}</div>
                        {officer.branch && (
                          <div className="text-sm text-gray-500">{officer.branch}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{officer.state}</Badge>
                    </TableCell>
                    <TableCell>
                      {officer.badgeNumber || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${officer.email}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        {officer.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOfficer(officer)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={deleteConfirm === officer.Id ? "danger" : "outline"}
                          size="sm"
                          onClick={() => handleDeleteOfficer(officer)}
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={selectedOfficer ? "Edit Officer" : "Add New Officer"}
        size="lg"
      >
        <OfficerForm
          officer={selectedOfficer}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Officers;