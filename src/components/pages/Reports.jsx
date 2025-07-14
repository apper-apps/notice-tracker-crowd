import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/molecules/Table";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { noticeService } from "@/services/api/noticeService";
import { officerService } from "@/services/api/officerService";
import { templateService } from "@/services/api/templateService";
import { format } from "date-fns";

const Reports = () => {
  const [notices, setNotices] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    state: "",
    organization: "",
    dateRange: "all",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notices, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [noticesData, officersData, templatesData] = await Promise.all([
        noticeService.getAll(),
        officerService.getAll(),
        templateService.getAll()
      ]);

      // Enhance notices with officer and template details
      const enhancedNotices = noticesData.map(notice => {
        const officer = officersData.find(o => o.Id === notice.recipientId);
        const template = templatesData.find(t => t.Id === notice.templateId);
        
        return {
          ...notice,
          recipientName: officer?.name || "Unknown Officer",
          recipientEmail: officer?.email || "",
          templateName: template?.name || "Custom Template",
        };
      });

      setNotices(enhancedNotices);
      setOfficers(officersData);
      setTemplates(templatesData);
    } catch (err) {
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notices];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(notice =>
        notice.recipientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        notice.organization.toLowerCase().includes(filters.search.toLowerCase()) ||
        notice.subject.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter(notice => notice.state === filters.state);
    }

    // Organization filter
    if (filters.organization) {
      filtered = filtered.filter(notice => 
        notice.organization.toLowerCase().includes(filters.organization.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(notice => new Date(notice.sentAt) >= cutoffDate);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    
    setFilteredNotices(filtered);
  };

  const exportToCsv = () => {
    const csvHeaders = [
      "Date Sent",
      "Recipient Name",
      "Organization",
      "State",
      "Subject",
      "Template Used",
      "Sent By"
    ];

    const csvData = filteredNotices.map(notice => [
      format(new Date(notice.sentAt), "yyyy-MM-dd HH:mm:ss"),
      notice.recipientName,
      notice.organization,
      notice.state,
      notice.subject,
      notice.templateName,
      notice.sentBy
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `notice_report_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      state: "",
      organization: "",
      dateRange: "all",
    });
  };

  const uniqueStates = [...new Set(notices.map(notice => notice.state))].sort();
  const uniqueOrganizations = [...new Set(notices.map(notice => notice.organization))].sort();

  if (loading) {
    return <Loading rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            View and analyze sent notice history
          </p>
        </div>
        <Button
          onClick={exportToCsv}
          disabled={filteredNotices.length === 0}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Download" className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <SearchBar
            placeholder="Search notices..."
            onSearch={(value) => handleFilterChange("search", value)}
            className="w-full"
          />
          
          <Select
            value={filters.state}
            onChange={(e) => handleFilterChange("state", e.target.value)}
          >
            <option value="">All States</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Select>
          
          <Select
            value={filters.organization}
            onChange={(e) => handleFilterChange("organization", e.target.value)}
          >
            <option value="">All Organizations</option>
            {uniqueOrganizations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </Select>
          
          <Select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="info">
              {filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''}
            </Badge>
            {(filters.search || filters.state || filters.organization || filters.dateRange !== "all") && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6">
        {filteredNotices.length === 0 ? (
          <Empty
            icon="FileBarChart"
            title="No notices found"
            message="No notices match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Sent By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.map((notice, index) => (
                  <motion.tr
                    key={notice.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {format(new Date(notice.sentAt), "MMM d, yyyy")}
                        </div>
                        <div className="text-gray-500">
                          {format(new Date(notice.sentAt), "h:mm a")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{notice.recipientName}</div>
                        <div className="text-sm text-gray-500">{notice.recipientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{notice.organization}</TableCell>
                    <TableCell>
                      <Badge variant="default">{notice.state}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={notice.subject}>
                        {notice.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{notice.templateName}</Badge>
                    </TableCell>
                    <TableCell>{notice.sentBy}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;