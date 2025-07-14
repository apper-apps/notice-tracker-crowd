import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { officerService } from "@/services/api/officerService";
import { templateService } from "@/services/api/templateService";
import { noticeService } from "@/services/api/noticeService";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOfficers: 0,
    totalTemplates: 0,
    totalNotices: 0,
    recentNotices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [officers, templates, notices] = await Promise.all([
        officerService.getAll(),
        templateService.getAll(),
        noticeService.getAll()
      ]);

      // Get recent notices with officer details
      const recentNotices = notices
        .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
        .slice(0, 5)
        .map(notice => {
          const officer = officers.find(o => o.Id === notice.recipientId);
          return {
            ...notice,
            recipientName: officer?.name || "Unknown Officer",
            recipientOrganization: officer?.organization || "Unknown Organization",
          };
        });

      setStats({
        totalOfficers: officers.length,
        totalTemplates: templates.length,
        totalNotices: notices.length,
        recentNotices,
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading rows={4} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const statCards = [
    {
      title: "Total Officers",
      value: stats.totalOfficers,
      icon: "Users",
      color: "bg-blue-500",
      link: "/officers",
    },
    {
      title: "Notice Templates",
      value: stats.totalTemplates,
      icon: "FileText",
      color: "bg-green-500",
      link: "/templates",
    },
    {
      title: "Notices Sent",
      value: stats.totalNotices,
      icon: "Send",
      color: "bg-accent-500",
      link: "/reports",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of your notice tracking system
          </p>
        </div>
        <Link to="/send-notice">
          <Button className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>Send Notice</span>
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={stat.link}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <ApperIcon
                      name={stat.icon}
                      className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notices</h2>
            <Link to="/reports">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          {stats.recentNotices.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notices sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentNotices.map((notice) => (
                <div
                  key={notice.Id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="Mail" className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notice.recipientName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {notice.recipientOrganization}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {format(new Date(notice.sentAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/officers">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="UserPlus" className="h-4 w-4 mr-3" />
                Add New Officer
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="FileText" className="h-4 w-4 mr-3" />
                Create Template
              </Button>
            </Link>
            <Link to="/send-notice">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Send" className="h-4 w-4 mr-3" />
                Send Notice
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="FileBarChart" className="h-4 w-4 mr-3" />
                View Reports
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;