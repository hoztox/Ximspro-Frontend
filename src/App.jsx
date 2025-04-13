import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { ThemeProvider, useTheme } from "./ThemeContext";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Password from "./pages/ForgotPassword/Password";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Companies from "./pages/Companies/Companies";
import AddCompany from "./pages/AddCompany/AddCompany";
import ViewCompany from "./pages/ViewCompany/ViewCompany";
import EditCompany from "./pages/EditCompany/EditCompany";
import AddSubscriber from "./pages/Subscribers/AddSubscriber/AddSubscriber";
import ManageSubscriber from "./pages/Subscribers/ManageSubscriber/ManageSubscriber";
import ChangeSubscription from "./pages/Subscribers/ChangeSubscription/ChangeSubscription";
import AddSubscriptionPlan from "./pages/Subscriptions/AddSubscriptionPlan/AddSubscriptionPlan";
import ManageSubscription from "./pages/Subscriptions/ManageSubscription/ManageSubscription";
import EditSubscription from "./pages/Subscriptions/EditSubscription.jsx/EditSubscription";
import ChangePassword from "./pages/ChangePassowrd/ChangePassword";
import CompanyLogin from "./pages/CompanyLogin/CompanyLogin";
import CompanyLayout from "./pages/CompanyLayout";
import CompanyDashboard from "./pages/Company Dashboard/CompanyDashboard";
import CompanyBackup from "./pages/Company Backup/CompanyBackup";
import QmsPolicy from "./pages/QMS/Documentation/Policy/QmsPolicy";
import QmsManual from "./pages/QMS/Documentation/Manual/QmsManual";
import QmsProcedure from "./pages/QMS/Documentation/Procedure/QmsProcedure";
import QmsRecordFormat from "./pages/QMS/Documentation/Record Format/QmsRecordFormat";
import QmsProcesses from "./pages/QMS/Documentation/Processes/QmsProcesses";
import QmsScopeStatements from "./pages/QMS/Documentation/Scope Statements/QmsScopeStatements";
import EmsPolicy from "./pages/EMS/Documentation/Policy/EmsPolicy";
import AddQmsPolicy from "./pages/QMS/Documentation/Policy/AddQmsPolicy";
import AddQmsManual from "./pages/QMS/Documentation/Manual/AddQmsManual";
import AddQmsProcedure from "./pages/QMS/Documentation/Procedure/AddQmsProcedure";
import AddQmsRecordFormat from "./pages/QMS/Documentation/Record Format/AddQmsRecordFormat";
import AddEmspolicy from "./pages/EMS/Documentation/Policy/AddEmspolicy";
import EmsManual from "./pages/EMS/Documentation/Manual/EmsManual";
import AddEmsManual from "./pages/EMS/Documentation/Manual/AddEmsManual";
import EmsProcedure from "./pages/EMS/Documentation/Procedure/EmsProcedure";
import AddEmsProcedure from "./pages/EMS/Documentation/Procedure/AddEmsProcedure";
import EmsRecordFormat from "./pages/EMS/Documentation/Record Format/EmsRecordFormat";
import AddEmsRecordFormat from "./pages/EMS/Documentation/Record Format/AddEmsRecordFormat";
import OhsPolicy from "./pages/OHS/Documentation/Policy/OhsPolicy";
import AddOhsPolicy from "./pages/OHS/Documentation/Policy/AddOhsPolicy";
import OhsManual from "./pages/OHS/Documentation/Manual/OhsManual";
import AddOhsManual from "./pages/OHS/Documentation/Manual/AddOhsManual";
import OhsProcedure from "./pages/OHS/Documentation/Procedure/OhsProcedure";
import AddOhsProcedure from "./pages/OHS/Documentation/Procedure/AddOhsProcedure";
import OhsRecordFormat from "./pages/OHS/Documentation/Record Format/OhsRecordFormat";
import AddOhsRecordFormat from "./pages/OHS/Documentation/Record Format/AddOhsRecordFormat";
import EnMSPolicy from "./pages/EnMS/Documentation/Policy/EnMSPolicy";
import AddEnMSPolicy from "./pages/EnMS/Documentation/Policy/AddEnMSPolicy";
import EnMSManual from "./pages/EnMS/Documentation/Manual/EnMSManual";
import AddEnMSManual from "./pages/EnMS/Documentation/Manual/AddEnMSManual";
import EnMSProcedure from "./pages/EnMS/Documentation/Procedure/EnMSProcedure";
import AddEnMSProcedure from "./pages/EnMS/Documentation/Procedure/AddEnMSProcedure";
import EnMSRecordFormat from "./pages/EnMS/Documentation/Record Format/EnMSRecordFormat";
import AddEnMSRecordFormat from "./pages/EnMS/Documentation/Record Format/AddEnMSRecordFormat";
import BMSPolicy from "./pages/BMS/Documentation/Policy/BMSPolicy";
import AddBMSPolicy from "./pages/BMS/Documentation/Policy/AddBMSPolicy";
import BmsManual from "./pages/BMS/Documentation/Manual/BmsManual";
import AddBmsManual from "./pages/BMS/Documentation/Manual/AddBmsManual";
import BmsProcedure from "./pages/BMS/Documentation/Procedure/BmsProcedure";
import AddBmsProcedure from "./pages/BMS/Documentation/Procedure/AddBmsProcedure";
import BmsRecordFormat from "./pages/BMS/Documentation/Record Format/BmsRecordFormat";
import AddBmsRecordFormat from "./pages/BMS/Documentation/Record Format/AddBmsRecordFormat";
import AMSPolicy from "./pages/AMS/Documentation/Policy/AMSPolicy";
import AddAMSPolicy from "./pages/AMS/Documentation/Policy/AddAMSPolicy";
import AmsManual from "./pages/AMS/Documentation/Manual/AmsManual";
import AddAmsManual from "./pages/AMS/Documentation/Manual/AddAmsManual";
import AmsProcedure from "./pages/AMS/Documentation/Procedure/AmsProcedure";
import AddAmsProcedure from "./pages/AMS/Documentation/Procedure/AddAmsProcedure";
import AmsRecordFormat from "./pages/AMS/Documentation/Record Format/AmsRecordFormat";
import AddAmsRecordFormat from "./pages/AMS/Documentation/Record Format/AddAmsRecordFormat";
import QMSAddUser from "./pages/QMS/UserManagement/AddUser/QMSAddUser";
import QMSListUser from "./pages/QMS/UserManagement/ListUser/QMSListUser";
import EMSAddUser from "./pages/EMS/UserManagement/AddUser/EMSAddUser";
import EMSListUser from "./pages/EMS/UserManagement/ListUser/EMSListUser";
import OHSAddUser from "./pages/OHS/UserManagement/AddUser/OHSAddUser"
import OHSListUser from "./pages/OHS/UserManagement/ListUser/OHSListUser";
import EnMSAddUser from "./pages/EnMS/UserManagement/AddUser/EnMSAddUser"
import EnMSListUser from "./pages/EnMS/UserManagement/ListUser/EnMSListUser";
import BMSAddUser from "./pages/BMS/UserManagement/AddUser/BMSAddUser";
import BMSListUser from "./pages/BMS/UserManagement/ListUser/BMSListUser";
import AMSAddUser from "./pages/AMS/UserManagement/AddUser/AMSAddUser";
import AMSListUser from "./pages/AMS/UserManagement/ListUser/AMSListUser";
import EditQmsPolicy from "./pages/QMS/Documentation/Policy/EditQmsPolicy";
import ViewQmsManual from "./pages/QMS/Documentation/Manual/ViewQmsManual";
import EditQmsmanual from "./pages/QMS/Documentation/Manual/EditQmsmanual";
import ViewAllNotifications from "./components/Company_Navbar/ViewAllNotifications";
import DraftQmsManual from "./pages/QMS/Documentation/Manual/DraftQmsManual";
import EditDraftQmsManual from "./pages/QMS/Documentation/Manual/EditDraftQmsManual";
import QMSEditUser from "./pages/QMS/UserManagement/EditUser/QMSEditUser";
import QMSViewUser from "./pages/QMS/UserManagement/ViewUser/QMSViewUser";
import DraftQmsProcedure from "./pages/QMS/Documentation/Procedure/DraftQmsProcedure";
import ViewQmsProcedure from "./pages/QMS/Documentation/Procedure/ViewQmsProcedure";
import EditQmsProcedure from "./pages/QMS/Documentation/Procedure/EditQmsProcedure";
import EditDraftQmsProcedure from "./pages/QMS/Documentation/Procedure/EditDraftQmsProcedure";
import ViewQmsRecordFormat from "./pages/QMS/Documentation/Record Format/ViewQmsRecordFormat";
import EditQmsRecordFormat from "./pages/QMS/Documentation/Record Format/EditQmsRecordFormat";
import DraftQmsRecordFormat from "./pages/QMS/Documentation/Record Format/DraftQmsRecordFormat";
import EditDraftQmsRecordFormat from "./pages/QMS/Documentation/Record Format/EditDraftQmsRecordFormat";
import QmsListTraining from "./pages/QMS/EmployeeTraining/ListTraining/QmsListTraining";
import QmsAddTraining from "./pages/QMS/EmployeeTraining/AddTraining/QmsAddTraining"
import QmsEditTraining from "./pages/QMS/EmployeeTraining/EditTraining/QmsEditTraining";
import QmsViewTraining from "./pages/QMS/EmployeeTraining/ViewTraining/QmsViewTraining";
import QmsListUserTraining from "./pages/QMS/EmployeeTraining/ListUserTraining/QmsListUserTraining";
import QmsTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/QmsTrainingEvaluation";
import QmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/QmsEmployeePerformance";
import AddQmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/AddQmsEmployeePerformance";
import EditQmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/EditQmsEmployeePerformance";
import ViewQmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/ViewQmsEmployeePerformance";
import QmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/QmsEmployeeSatisfaction";
import AddQmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/AddQmsEmployeeSatisfaction";
import EditQmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/EditQmsEmployeeSatisfaction";
import ViewQmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/ViewQmsEmployeeSatisfaction";
import QmsListAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsListAwarenessTraining";
import QmsAddAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsAddAwarenessTraining";
import QmsListCompliance from "./pages/QMS/Compliance/QmsListCompliance";
import QmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/QmsInterestedParties";
import AddQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/AddQmsInterestedParties";
import EditQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/EditQmsInterestedParties";
import ViewQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/ViewQmsInterestedParties";
import DraftQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/DraftQmsInterestedParties";
import EditDraftQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/EditDraftQmsInterestedParties";
import AddQmsProcesses from "./pages/QMS/Documentation/Processes/AddQmsProcesses";
import ViewQmsProcesses from "./pages/QMS/Documentation/Processes/ViewQmsProcesses";
import EditQmsProcesses from "./pages/QMS/Documentation/Processes/EditQmsProcesses";
import QmsAddCompliance from "./pages/QMS/Compliance/QmsAddCompliance";
import DraftQmsProcesses from "./pages/QMS/Documentation/Processes/DraftQmsProcesses";
import EditQmsDraftProcesses from "./pages/QMS/Documentation/Processes/EditQmsDraftProcesses";
import ViewQmsDraftInterestedParties from "./pages/QMS/Documentation/InterestedParties/ViewQmsDraftInterestedParties";
import ViewQmsDraftProcesses from "./pages/QMS/Documentation/Processes/ViewQmsDraftProcesses";

const ThemedApp = () => {
  const { theme } = useTheme();

  // Apply the theme class to the body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/">
          <Route index element={<AdminLogin />} />
          <Route path="forgotpassword" element={<Password />} />
          <Route path="changepassword" element={<ChangePassword />} />
        </Route>


        <Route path="/company-login">
          <Route index element={<CompanyLogin />} />
        </Route>

        <Route path="/company" element={<CompanyLayout />}>
          <Route path="dashboard" element={<CompanyDashboard />} />

          {/* QMS Documentation */}
          <Route path="qms/policy" element={<QmsPolicy />} />
          <Route path="qms/addpolicy" element={<AddQmsPolicy />} />
          <Route path="qms/editpolicy/:id" element={<EditQmsPolicy/>} />

          <Route path="qms/manual" element={<QmsManual />} />
          <Route path="qms/addmanual" element={<AddQmsManual />} />
          <Route path="qms/viewmanual/:id" element={<ViewQmsManual />} />
          <Route path="qms/editmanual/:id" element={<EditQmsmanual />} />
          <Route path="qms/draftmanual" element={<DraftQmsManual/>} />
          <Route path="qms/editdraftmanual/:id" element={<EditDraftQmsManual/>} />
          <Route path="notifications" element = {<ViewAllNotifications/>}/>
          

          <Route path="qms/procedure" element={<QmsProcedure />} />
          <Route path="qms/addprocedure" element={<AddQmsProcedure />} />
          <Route path="qms/viewprocedure/:id" element={<ViewQmsProcedure/>} />
          <Route path="qms/editprocedure/:id" element={<EditQmsProcedure/>} />
          <Route path="qms/draftprocedure" element={<DraftQmsProcedure/>} />
          <Route path="qms/editdraftprocedure/:id" element={<EditDraftQmsProcedure/>} />

          <Route path="qms/record-format" element={<QmsRecordFormat />} />
          <Route path="qms/addrecordformat" element={<AddQmsRecordFormat />} />
          <Route path="qms/viewrecordformat/:id" element={<ViewQmsRecordFormat />} />
          <Route path="qms/editrecordformat/:id" element={<EditQmsRecordFormat />} />
          <Route path="qms/draftrecordformat" element={<DraftQmsRecordFormat />} />
          <Route path="qms/editdraftrecordformat/:id" element={<EditDraftQmsRecordFormat />} />

          <Route path="qms/interested-parties" element={<QmsInterestedParties />} />
          <Route path="qms/add-interested-parties" element={<AddQmsInterestedParties />} />
          <Route path="qms/edit-interested-parties/:id" element={<EditQmsInterestedParties />} />
          <Route path="qms/view-interested-parties/:id" element={<ViewQmsInterestedParties />} />
          <Route path="qms/draft-interested-parties" element={<DraftQmsInterestedParties />} />
          <Route path="qms/edit-draft-interested-parties/:id" element={<EditDraftQmsInterestedParties />} />
          <Route path="qms/view-draft-interested-parties/:id" element={<ViewQmsDraftInterestedParties />} />



          <Route path="qms/processes" element={<QmsProcesses />} />
          <Route path="qms/add-processes" element={<AddQmsProcesses/>} />
          <Route path="qms/view-processes/:id" element={<ViewQmsProcesses/>} />
          <Route path="qms/edit-processes/:id" element={<EditQmsProcesses/>} />
          <Route path="qms/draft-processes" element={<DraftQmsProcesses/>} />
          <Route path="qms/edit-draft-processes/:id" element={<EditQmsDraftProcesses/>} />
          <Route path="qms/view-draft-processes/:id" element={<ViewQmsDraftProcesses/>} />




          <Route path="qms/scope-statements" element={<QmsScopeStatements />} />


          {/* QMS Employee Training */}
          <Route path="qms/list-training" element={<QmsListTraining />} />
          <Route path="qms/add-training" element={<QmsAddTraining />} />
          <Route path="qms/edit-training" element={<QmsEditTraining/>} />
          <Route path="qms/view-training" element={<QmsViewTraining/>} />
          <Route path="qms/listuser-training" element={<QmsListUserTraining/>} />
          <Route path="qms/training-evaluation" element={<QmsTrainingEvaluation/>} />
          <Route path="qms/employee-performance" element={<QmsEmployeePerformance/>} />
          <Route path="qms/add-employee-performance" element={<AddQmsEmployeePerformance/>} />
          <Route path="qms/edit-employee-performance" element={<EditQmsEmployeePerformance/>} />
          <Route path="qms/view-employee-performance" element={<ViewQmsEmployeePerformance/>} />
          <Route path="qms/list-satisfaction-survey" element={<QmsEmployeeSatisfaction/>}/>
          <Route path="qms/add-satisfaction-survey" element={<AddQmsEmployeeSatisfaction/>}/>
          <Route path="qms/edit-satisfaction-survey" element={<EditQmsEmployeeSatisfaction/>}/>
          <Route path="qms/view-satisfaction-survey" element={<ViewQmsEmployeeSatisfaction/>}/>
          <Route path="qms/list-awareness-training" element={<QmsListAwarenessTraining/>} />
          <Route path="qms/add-awareness-training" element={<QmsAddAwarenessTraining/>} />

           {/* QMS Compliance*/}
           <Route path="qms/list-compliance" element={<QmsListCompliance />} />
           <Route path="qms/add-compliance" element={<QmsAddCompliance />} />


          {/* QMS User Management */}
          <Route path="qms/adduser" element={<QMSAddUser />} />
          <Route path="qms/listuser" element={<QMSListUser />} />
          <Route path="qms/edituser/:id" element={<QMSEditUser/>} />
          <Route path="qms/user-details/:id" element={<QMSViewUser/>} />
















          {/* EMS Documentation */}
          <Route path="ems/policy" element={<EmsPolicy />} />
          <Route path="ems/addpolicy" element={<AddEmspolicy />} />

          <Route path="ems/manual" element={<EmsManual />} />
          <Route path="ems/addmanual" element={<AddEmsManual />} />

          <Route path="ems/procedure" element={<EmsProcedure />} />
          <Route path="ems/addprocedure" element={<AddEmsProcedure />} />

          <Route path="ems/record-format" element={<EmsRecordFormat />} />
          <Route path="ems/addrecordformat" element={<AddEmsRecordFormat />} />


          {/* EMS User Management */}
          <Route path="ems/adduser" element={<EMSAddUser />} />
          <Route path="ems/listuser" element={<EMSListUser />} />




          {/* OHS Documentation */}
          <Route path="ohs/policy" element={<OhsPolicy />} />
          <Route path="ohs/addpolicy" element={<AddOhsPolicy />} />

          <Route path="ohs/manual" element={<OhsManual />} />
          <Route path="ohs/addmanual" element={<AddOhsManual />} />

          <Route path="ohs/procedure" element={<OhsProcedure />} />
          <Route path="ohs/addprocedure" element={<AddOhsProcedure />} />

          <Route path="ohs/record-format" element={<OhsRecordFormat />} />
          <Route path="ohs/addrecordformat" element={<AddOhsRecordFormat />} />


          {/* OHS User Management */}
          <Route path="ohs/adduser" element={<OHSAddUser />} />
          <Route path="ohs/listuser" element={<OHSListUser />} />




          {/* EnMS Documentation */}
          <Route path="enms/policy" element={<EnMSPolicy />} />
          <Route path="enms/addpolicy" element={<AddEnMSPolicy />} />

          <Route path="enms/manual" element={<EnMSManual />} />
          <Route path="enms/addmanual" element={<AddEnMSManual />} />

          <Route path="enms/procedure" element={<EnMSProcedure />} />
          <Route path="enms/addprocedure" element={<AddEnMSProcedure />} />

          <Route path="enms/record-format" element={<EnMSRecordFormat />} />
          <Route path="enms/addrecordformat" element={<AddEnMSRecordFormat />} />


          {/* EnMS User Management */}
          <Route path="enms/adduser" element={<EnMSAddUser />} />
          <Route path="enms/listuser" element={<EnMSListUser />} />




          {/* BMS Documentation */}
          <Route path="bms/policy" element={<BMSPolicy />} />
          <Route path="bms/addpolicy" element={<AddBMSPolicy />} />

          <Route path="bms/manual" element={<BmsManual />} />
          <Route path="bms/addmanual" element={<AddBmsManual />} />

          <Route path="bms/procedure" element={<BmsProcedure />} />
          <Route path="bms/addprocedure" element={<AddBmsProcedure />} />

          <Route path="bms/record-format" element={<BmsRecordFormat />} />
          <Route path="bms/addrecordformat" element={<AddBmsRecordFormat />} />


          {/* BMS User Management */}
          <Route path="bms/adduser" element={<BMSAddUser />} />
          <Route path="bms/listuser" element={<BMSListUser />} />





          {/* AMS Documentation */}
          <Route path="ams/policy" element={<AMSPolicy />} />
          <Route path="ams/addpolicy" element={<AddAMSPolicy />} />

          <Route path="ams/manual" element={<AmsManual />} />
          <Route path="ams/addmanual" element={<AddAmsManual />} />

          <Route path="ams/procedure" element={<AmsProcedure />} />
          <Route path="ams/addprocedure" element={<AddAmsProcedure />} />

          <Route path="ams/record-format" element={<AmsRecordFormat />} />
          <Route path="ams/addrecordformat" element={<AddAmsRecordFormat />} />


          {/* AMS User Management */}
          <Route path="ams/adduser" element={<AMSAddUser />} />
          <Route path="ams/listuser" element={<AMSListUser />} />






          <Route path="backup" element={<CompanyBackup />} />
        </Route>

        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />

          <Route path="add-subscriber" element={<AddSubscriber />} />
          <Route path="manage-subscriber" element={<ManageSubscriber />} />
          <Route path="change-subscriber/:id" element={<ChangeSubscription />} />

          <Route path="add-subscription-plan" element={<AddSubscriptionPlan />} />
          <Route path="manage-subscription" element={<ManageSubscription />} />
          <Route path="edit-subscription/:id" element={<EditSubscription />} />



          <Route path="addcompany" element={<AddCompany />} />
          <Route path="viewcompany/:companyId" element={<ViewCompany />} />
          <Route path="editcompany/:companyId" element={<EditCompany />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider>
    <ThemedApp />
  </ThemeProvider>
);

export default App;