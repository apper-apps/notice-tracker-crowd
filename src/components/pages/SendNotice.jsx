import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import NoticeComposer from "@/components/organisms/NoticeComposer";

const SendNotice = () => {
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    // Detect if running in iframe
    setIsIframe(window.self !== window.top);
  }, []);

  const handleSuccess = (noticeData) => {
    if (isIframe) {
      // Send success message to parent window
      window.parent.postMessage({
        type: 'NOTICE_SENT_SUCCESS',
        payload: {
          message: 'Notice sent successfully',
          noticeData: noticeData
        }
      }, '*');
    }
  };

  const handleError = (error) => {
    if (isIframe) {
      // Send error message to parent window
      window.parent.postMessage({
        type: 'NOTICE_SENT_ERROR',
        payload: {
          message: 'Failed to send notice',
          error: error.message
        }
      }, '*');
    }
  };

  return (
    <div className={`${isIframe ? 'iframe-container' : 'space-y-6'}`}>
      {!isIframe && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Send Notice</h1>
          <p className="text-gray-600 mt-1">
            Compose and send official notices to public officers
          </p>
        </div>
      )}

      <Card className={`${isIframe ? 'iframe-card' : 'p-6'}`}>
        <NoticeComposer 
          onSuccess={handleSuccess} 
          onError={handleError}
          isIframe={isIframe}
        />
      </Card>
    </div>
  );
};

export default SendNotice;