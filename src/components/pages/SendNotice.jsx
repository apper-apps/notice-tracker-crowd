import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import NoticeComposer from "@/components/organisms/NoticeComposer";

const SendNotice = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/reports");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Send Notice</h1>
        <p className="text-gray-600 mt-1">
          Compose and send official notices to public officers
        </p>
      </div>

      <Card className="p-6">
        <NoticeComposer onSuccess={handleSuccess} />
      </Card>
    </div>
  );
};

export default SendNotice;