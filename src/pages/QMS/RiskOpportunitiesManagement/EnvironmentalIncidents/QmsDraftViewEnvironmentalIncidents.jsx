 
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../../../Utils/Config';

const QmsDraftViewEnvironmentalIncidents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incidentData, setIncidentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch incident data
  const fetchIncidentData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/qms/incident-get/${id}/`);
      const data = response.data;
      if (!data.is_draft) {
        setError('This incident is not a draft.');
        setIncidentData(null);
      } else {
        setIncidentData(data);
      }
    } catch (error) {
      console.error('Error fetching incident data:', error);
      setError('Failed to load draft incident data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIncidentData();
    } else {
      setError('Invalid incident ID.');
      setIsLoading(false);
    }
  }, [id]);

  // Navigation handler
  const handleClose = () => {
    navigate('/company/qms/draft-environmantal-incident');
  };

  // Format date (e.g., '2025-10-14' to '14-10-2025')
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '/');
  };

  if (isLoading) {
    return (
      <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-96">
        <p>Loading draft incident data...</p>
      </div>
    );
  }

  if (error || !incidentData) {
    return (
      <div className="bg-[#1C1C24] text-white rounded-lg p-5">
        <div className="flex justify-between items-center border-b border-[#383840] pb-5">
          <h2 className="view-employee-head">Draft Environmental Incidents Information</h2>
          <button
            onClick={handleClose}
            className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
          >
            <X className="text-white" />
          </button>
        </div>
        <div className="p-5 text-red-300">{error || 'No draft incident data available.'}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Draft Environmental Incidents Information</h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="p-5 relative">
        {/* Vertical divider line */}
        <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          <div>
            <label className="block view-employee-label mb-[6px]">Source</label>
            <div className="view-employee-data">{incidentData.source || 'N/A'}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Incident Title</label>
            <div className="view-employee-data">{incidentData.title || 'N/A'}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Incident No</label>
            <div className="view-employee-data">{incidentData.incident_no || 'N/A'}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Status</label>
            <div className="view-employee-data">{incidentData.status || 'N/A'}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Root Cause</label>
            <div className="view-employee-data">{incidentData.root_cause?.title || 'N/A'}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Reported By</label>
            <div className="view-employee-data">
              {incidentData.reported_by
                ? `${incidentData.reported_by.first_name} ${incidentData.reported_by.last_name || ''}`
                : 'N/A'}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Incident Description</label>
            <div className="view-employee-data">{incidentData.description || 'N/A'}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Action or Corrections</label>
            <div className="view-employee-data">{incidentData.action || 'N/A'}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Date Raised</label>
            <div className="view-employee-data">{formatDate(incidentData.date_raised)}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Complete By</label>
            <div className="view-employee-data">{formatDate(incidentData.date_completed)}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Remarks</label>
            <div className="view-employee-data">{incidentData.remarks || 'N/A'}</div> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsDraftViewEnvironmentalIncidents;
