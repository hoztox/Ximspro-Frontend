import React, { useState } from "react";
import { Search } from "lucide-react";
import plusicon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const OhsProcedure = () => {
  const [procedure, setProcedure] = useState([
    {
      id: 1,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 2,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 3,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 4,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 5,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 6,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 7,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 8,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 9,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 10,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 11,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 12,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 13,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 14,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 15,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 16,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 17,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 18,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 19,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
    {
      id: 20,
      procedure_title: "Anonymous",
      procedure_no: "Anonymous",
      approved_by: "Anonymous",
      revision: "Anonymous",
      date: "03-12-2024",
    },
  ]);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const procedurePerPage = 10;

  const filteredProcedure = procedure.filter(
    (procedures) =>
      procedures.procedure_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      procedures.procedure_no
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      procedures.approved_by
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      procedures.revision.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedures.date
        .replace(/^0+/, "")
        .includes(searchQuery.replace(/^0+/, "")) // Normalizing date search
  );

  const totalPages = Math.ceil(filteredProcedure.length / procedurePerPage);
  const paginatedProcedure = filteredProcedure.slice(
    (currentPage - 1) * procedurePerPage,
    currentPage * procedurePerPage
  );

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
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleAddProcedure = () => {
    navigate("/company/ohs/addprocedure");
  };

  return (
    <div className="bg-[#1C1C24] list-manual-main">
      <div className="flex items-center justify-between px-[14px] pt-[24px]">
        <h1 className="list-manual-head">List Procedures</h1>
        <div className="flex space-x-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="serach-input-manual focus:outline-none bg-transparent"
            />
            <div className="absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#F9291F] text-[#F9291F] hover:bg-[#F9291F] hover:text-white"
            onClick={handleAddProcedure}
          >
            <span>Add Procedure</span>
            <img
              src={plusicon}
              alt="Add Icon"
              className="w-[18px] h-[18px] ohs-add-plus"
            />
          </button>
        </div>
      </div>

      <div className="p-5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#24242D]">
            <tr className="h-[48px]">
              <th className="px-5 text-left add-manual-theads">No</th>
              <th className="px-5 text-left add-manual-theads">
                Procedure Title
              </th>
              <th className="px-5 text-left add-manual-theads">Procedure No</th>
              <th className="px-5 text-left add-manual-theads">Approved by</th>
              <th className="px-5 text-left add-manual-theads">Revision</th>
              <th className="px-5 text-left add-manual-theads">Date</th>
              <th className="px-5 text-center add-manual-theads">Edit</th>
              <th className="px-5 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProcedure.length > 0 ? (
              paginatedProcedure.map((procedure, index) => (
                <tr
                  key={procedure.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] cursor-pointer h-[46px]"
                >
                  <td className="px-[23px] add-manual-datas">
                    {(currentPage - 1) * procedurePerPage + index + 1}
                  </td>
                  <td className="px-5 add-manual-datas">
                    {procedure.procedure_title}
                  </td>
                  <td className="px-5 add-manual-datas">
                    {procedure.procedure_no}
                  </td>
                  <td className="px-5 add-manual-datas">
                    {procedure.approved_by}
                  </td>
                  <td className="px-5 add-manual-datas">
                    {procedure.revision}
                  </td>
                  <td className="px-5 add-manual-datas">{procedure.date}</td>
                  <td className="px-4 add-manual-datas text-center">
                    <button>
                      <img
                        src={edits}
                        alt="Edit"
                        className="w-[16px] h-[16px]"
                      />
                    </button>
                  </td>
                  <td className="px-4 add-manual-datas text-center">
                    <button>
                      <img
                        src={deletes}
                        alt="Delete"
                        className="w-[16px] h-[16px]"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 not-found">
                  No Procedures found.
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="8" className="pt-[15px] border-t border-[#383840]">
                <div className="flex items-center justify-between">
                  <div className="text-white total-text">
                    Total-{filteredProcedure.length}
                  </div>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="cursor-pointer swipe-text"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`${
                            currentPage === page
                              ? "pagin-active"
                              : "pagin-inactive"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer swipe-text"
                    >
                      Next
                    </button>
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

export default OhsProcedure;
