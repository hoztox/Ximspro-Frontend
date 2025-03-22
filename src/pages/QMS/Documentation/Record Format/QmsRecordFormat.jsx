import React, { useState } from 'react'
import { Search } from 'lucide-react';
import plusicon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsRecordFormat = () => {
  const [recordFormat, setRecordFormat] = useState([
    { id: 1, record_title: "Anonymous", record_no: "Anonymous", approved_by: "Anonymous", revision: "Anonymous", date: '03-12-2024' },
    { id: 2, record_title: "Anonymous", record_no: "Anonymous", approved_by: "Anonymous", revision: "Anonymous", date: '03-12-2024' },
    { id: 3, record_title: "Anonymous", record_no: "Anonymous", approved_by: "Anonymous", revision: "Anonymous", date: '03-12-2024' },
  ])

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordFormatPerPage = 10;

  const filteredrecordFormat = recordFormat.filter(recordFormats =>
    recordFormats.record_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recordFormats.record_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recordFormats.approved_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recordFormats.revision.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recordFormats.date.replace(/^0+/, '').includes(searchQuery.replace(/^0+/, ''))
  );

  const totalPages = Math.ceil(filteredrecordFormat.length / recordFormatPerPage);
  const paginatedRecordFormat = filteredrecordFormat.slice((currentPage - 1) * recordFormatPerPage, currentPage * recordFormatPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleAddRecordFormat = () => {
    navigate('/company/qms/addrecordformat')
  }

  return (
    <div className="bg-[#1C1C24] list-manual-main">
      <div className="flex items-center justify-between px-[14px] pt-[24px]">
        <h1 className="list-manual-head">List Record Formats</h1>
        <div className="flex space-x-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="serach-input-manual focus:outline-none bg-transparent"
            />
            <div className='absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
              <Search size={18} />
            </div>
          </div>
           <button className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddRecordFormat}
          >
            <span> Add Record Format</span>
            <img src={plusicon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
          </button>
        </div>
      </div>

      <div className="p-5 overflow-hidden">
        <table className="w-full">
          <thead className='bg-[#24242D]'>
            <tr className="h-[48px]">
              <th className="px-5 text-left add-manual-theads">No</th>
              <th className="px-5 text-left add-manual-theads">Record Title</th>
              <th className="px-5 text-left add-manual-theads">Record No</th>
              <th className="px-5 text-left add-manual-theads">Approved by</th>
              <th className="px-5 text-left add-manual-theads">Revision</th>
              <th className="px-5 text-left add-manual-theads">Date</th>
              <th className="px-5 text-center add-manual-theads">Edit</th>
              <th className="px-5 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecordFormat.length > 0 ? (
              paginatedRecordFormat.map((recordFormats, index) => (
                <tr key={recordFormats.id} className="border-b border-[#383840] hover:bg-[#1a1a20] cursor-pointer h-[46px]">
                  <td className="px-[23px] add-manual-datas">{(currentPage - 1) * recordFormatPerPage + index + 1}</td>
                  <td className="px-5 add-manual-datas">{recordFormats.record_title}</td>
                  <td className="px-5 add-manual-datas">{recordFormats.record_no}</td>
                  <td className="px-5 add-manual-datas">{recordFormats.approved_by}</td>
                  <td className="px-5 add-manual-datas">{recordFormats.revision}</td>
                  <td className="px-5 add-manual-datas">{recordFormats.date}</td>
                  <td className="px-4 add-manual-datas text-center">
                    <button><img src={edits} alt="Edit" className='w-[16px] h-[16px]' /></button>
                  </td>
                  <td className="px-4 add-manual-datas text-center">
                    <button><img src={deletes} alt="Delete" className='w-[16px] h-[16px]' /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 not-found">No Procedures found.</td>
              </tr>
            )}
            <tr>
              <td colSpan="8" className="pt-[15px] border-t border-[#383840]">
                <div className="flex items-center justify-between">
                  <div className="text-white total-text">Total-{filteredrecordFormat.length}</div>
                  <div className="flex items-center gap-5">
                    <button onClick={handlePrevious} disabled={currentPage === 1} className="cursor-pointer swipe-text">Previous</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => handlePageClick(page)} className={`${currentPage === page ? 'pagin-active' : 'pagin-inactive'}`}>{page}</button>
                    ))}
                    <button onClick={handleNext} disabled={currentPage === totalPages} className="cursor-pointer swipe-text">Next</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QmsRecordFormat
