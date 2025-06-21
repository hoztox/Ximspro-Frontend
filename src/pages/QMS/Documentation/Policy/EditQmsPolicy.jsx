import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import bold from "../../../../assets/images/Company Documentation/bold.svg";
import itallic from "../../../../assets/images/Company Documentation/itallic.svg";
import underline from "../../../../assets/images/Company Documentation/underline.svg";
import files from "../../../../assets/images/Company Documentation/file-icon.svg";
import leftalign from "../../../../assets/images/Company Documentation/text-align-left.svg";
import centeralign from "../../../../assets/images/Company Documentation/text-allign-center.svg";
import rightalign from "../../../../assets/images/Company Documentation/text-align-right.svg";
import sentencetext from "../../../../assets/images/Company Documentation/text-sentence.svg";
import orderedlist from "../../../../assets/images/Company Documentation/ordered-list.svg";
import unorderedlist from "../../../../assets/images/Company Documentation/unorderedlist.svg";
import textindednt from "../../../../assets/images/Company Documentation/text-indent.svg";
import textoutdent from "../../../../assets/images/Company Documentation/text-outdent.svg";
import imagelink from "../../../../assets/images/Company Documentation/image-link.svg";
import imageupload from "../../../../assets/images/Company Documentation/image-upload.svg";
import addlinks from "../../../../assets/images/Company Documentation/add-link.svg";
import removelinks from "../../../../assets/images/Company Documentation/remove-link.svg";
import textcolor from "../../../../assets/images/Company Documentation/text-color.svg";
import textbgcolor from "../../../../assets/images/Company Documentation/bg-color.svg";
import { ChevronDown, Eye } from "lucide-react";
import { BASE_URL } from "../../../../Utils/Config";
import "./addqmspolicys.css";
import EditQmsPolicySuccessModal from "./Modals/EditQmsPolicySuccessModal";
import EditQmsPolicyErrorModal from "./Modals/EditQmsPolicyErrorModal";

const EditQmsPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    existingPolicy: null,
    newPolicy: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState(""); // NEW: For content validation
  const [errorMessage, setErrorMessage] = useState("");
  const [showEditPolicySuccessModal, setShowEditPolicySuccessModal] = useState(false);
  const [showEditPolicyErrorModal, setShowEditPolicyErrorModal] = useState(false);

  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null); // NEW: For file input
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left",
    unorderedList: false,
    orderedList: false,
    indent: false,
    outdent: false,
    textColor: "#FFFFFF",
    bgColor: "transparent",
  });

  const colorPalette = [
    "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF",
    "#FF00FF", "#C0C0C0", "#808080", "#800000", "#808000", "#008000", "#800080",
    "#008080", "#000080", "#FFA500", "#A52A2A", "#F5F5DC", "#FFD700",
  ];

  // UPDATED: Font options with tooltips
  const fontSizes = [
    { label: "Small", value: "1", tooltip: "Small font size for compact text" },
    { label: "Normal", value: "3", tooltip: "Standard font size for regular text" },
    { label: "Large", value: "5", tooltip: "Large font size for emphasis" },
    { label: "Extra Large", value: "7", tooltip: "Extra large font size for headings" },
  ];

  const fontStyles = [
    { label: "Arial", value: "Arial", tooltip: "Clean, sans-serif font for modern text" },
    { label: "Times New Roman", value: "Times New Roman", tooltip: "Traditional serif font for formal text" },
    { label: "Courier New", value: "Courier New", tooltip: "Monospace font for code-like text" },
    { label: "Georgia", value: "Georgia", tooltip: "Serif font with a classic, elegant style" },
  ];

  const fontFormats = [
    { label: "Paragraph", value: "p", tooltip: "Standard paragraph format" },
    { label: "Heading 1", value: "h1", tooltip: "Main heading for sections" },
    { label: "Heading 2", value: "h2", tooltip: "Subheading for subsections" },
    { label: "Heading 3", value: "h3", tooltip: "Minor heading for smaller sections" },
    { label: "Preformatted", value: "pre", tooltip: "Preserves whitespace and uses monospace font" },
  ];

  const [selectedFontSize, setSelectedFontSize] = useState(fontSizes[1].label);
  const [selectedFontStyle, setSelectedFontStyle] = useState(fontStyles[0].label);
  const [selectedFontFormat, setSelectedFontFormat] = useState(fontFormats[0].label);

  useEffect(() => {
    fetchPolicyDetails();
  }, [id]);

  const getUserCompanyId = () => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;

    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      const userData = localStorage.getItem("user_company_id");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error("Error parsing user company ID:", e);
          return null;
        }
      }
    }
    return null;
  };

  const extractFilenameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleViewFile = () => {
    if (formData.existingPolicy && formData.existingPolicy.url) {
      window.open(formData.existingPolicy.url, "_blank");
    } else {
      toast.error("No file is available to view");
    }
  };

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
    setTitleError("");
  };

  const fetchPolicyDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/qms/policy-get/${id}/`);
      const policyData = response.data;

      setFormData((prev) => ({
        ...prev,
        title: policyData.title || "",
        content: policyData.text || "",
        existingPolicy: policyData.energy_policy ? {
          name: extractFilenameFromUrl(policyData.energy_policy),
          url: policyData.energy_policy,
        } : null,
      }));

      if (editorRef.current && policyData.text) {
        editorRef.current.innerHTML = policyData.text;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching policy details:", error);
      toast.error("Failed to load policy details");
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, newPolicy: file }));
    }
  };

  // NEW: Clear selected file
const handleClearFile = () => {
  setFormData({ ...formData, newPolicy: null, existingPolicy: null });
  if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }
};

  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        editorRef.current.focus();
        document.execCommand("insertImage", false, imageUrl);

        setTimeout(() => {
          const images = editorRef.current.querySelectorAll("img");
          const insertedImage = images[images.length - 1];
          if (insertedImage) {
            insertedImage.style.maxWidth = "100%";
            insertedImage.style.height = "auto";
            insertedImage.style.display = "block";
            insertedImage.style.margin = "10px 0";
          }
        }, 0);
      };

      reader.readAsDataURL(file);
      e.target.value = null;
    }
  };

  const initializeDefaultStyles = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand("fontName", false, fontStyles[0].value);
    document.execCommand("fontSize", false, fontSizes[1].value);
    document.execCommand("formatBlock", false, fontFormats[0].value);
  };

  const execCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      if (command === "insertUnorderedList" || command === "insertOrderedList") {
        setTimeout(() => updateActiveStyles(), 10);
      } else {
        updateActiveStyles();
      }
    }
  };

  const handleTextColor = (color) => {
    execCommand("foreColor", color);
    setActiveStyles((prev) => ({ ...prev, textColor: color }));
    setShowTextColorPicker(false);
  };

  const handleBackgroundColor = (color) => {
    execCommand("hiliteColor", color);
    setActiveStyles((prev) => ({ ...prev, bgColor: color }));
    setShowBgColorPicker(false);
  };

  const toggleTextColorPicker = () => {
    setShowTextColorPicker(!showTextColorPicker);
    setShowBgColorPicker(false);
  };

  const toggleBgColorPicker = () => {
    setShowBgColorPicker(!showBgColorPicker);
    setShowTextColorPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowTextColorPicker(false);
        setShowBgColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateActiveStyles = () => {
    if (document.activeElement !== editorRef.current) return;

    const formatBlock = document.queryCommandValue("formatBlock");
    const textColor = document.queryCommandValue("foreColor");
    const bgColor = document.queryCommandValue("hiliteColor") || "transparent";

    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      align: document.queryCommandState("justifyCenter")
        ? "center"
        : document.queryCommandState("justifyRight")
          ? "right"
          : document.queryCommandState("justifyFull")
            ? "justify"
            : "left",
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
      indent: false,
      outdent: false,
      formatBlock: formatBlock || "p",
      textColor: textColor || "#FFFFFF",
      bgColor: bgColor || "transparent",
    });

    if (formatBlock) {
      const fontFormatOption = fontFormats.find((option) => option.value === formatBlock);
      if (fontFormatOption) setSelectedFontFormat(fontFormatOption.label);
    }

    const fontName = document.queryCommandValue("fontName");
    if (fontName) {
      const matchedFont = fontStyles.find(
        (font) => fontName.includes(font.value) || font.value === fontName
      );
      if (matchedFont) {
        setSelectedFontStyle(matchedFont.label);
      } else if (fontName.includes(",")) {
        const firstFont = fontName.split(",")[0].trim().replace(/"/g, "");
        setSelectedFontStyle(firstFont);
      } else {
        setSelectedFontStyle(fontName);
      }
    }

    const fontSize = document.queryCommandValue("fontSize");
    if (fontSize) {
      const fontSizeOption = fontSizes.find((option) => option.value === fontSize);
      if (fontSizeOption) setSelectedFontSize(fontSizeOption.label);
    }
  };

  const createList = (type) => {
    editorRef.current.focus();
    const command = type === "ul" ? "insertUnorderedList" : "insertOrderedList";
    document.execCommand(command, false, null);

    setTimeout(() => {
      const lists = editorRef.current.querySelectorAll("ul, ol");
      lists.forEach((list) => {
        if (list.tagName === "UL") {
          list.style.display = "block";
          list.style.listStyleType = "disc";
          list.style.paddingLeft = "40px";
          list.style.marginLeft = "0";
        } else if (list.tagName === "OL") {
          list.style.display = "block";
          list.style.listStyleType = "decimal";
          list.style.paddingLeft = "40px";
          list.style.marginLeft = "0";
        }
        const items = list.querySelectorAll("li");
        items.forEach((item) => item.style.display = "list-item");
      });
      updateActiveStyles();
    }, 10);
  };

  const handleList = (type) => createList(type);

  const handleIndent = () => {
    editorRef.current.focus();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    let currentNode = range.commonAncestorContainer;
    if (currentNode.nodeType === 3) currentNode = currentNode.parentNode;

    let listItem = null;
    while (currentNode && currentNode !== editorRef.current) {
      if (currentNode.nodeName === "LI") {
        listItem = currentNode;
        break;
      }
      currentNode = currentNode.parentNode;
    }

    if (listItem) {
      execCommand("indent");
    } else {
      execCommand("formatBlock", "<div>");
      const selectedElement = document.getSelection().anchorNode.parentNode;
      const currentPadding = parseInt(selectedElement.style.paddingLeft || "0");
      selectedElement.style.paddingLeft = currentPadding + 40 + "px";
      setActiveStyles((prev) => ({ ...prev, indent: true }));
    }
  };

  const handleOutdent = () => {
    editorRef.current.focus();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    let currentNode = range.commonAncestorContainer;
    if (currentNode.nodeType === 3) currentNode = currentNode.parentNode;

    let listItem = null;
    while (currentNode && currentNode !== editorRef.current) {
      if (currentNode.nodeName === "LI") {
        listItem = currentNode;
        break;
      }
      currentNode = currentNode.parentNode;
    }

    if (listItem) {
      execCommand("outdent");
    } else {
      const selectedElement = document.getSelection().anchorNode.parentNode;
      const currentPadding = parseInt(selectedElement.style.paddingLeft || "0");
      if (currentPadding > 0) {
        selectedElement.style.paddingLeft = Math.max(0, currentPadding - 40) + "px";
      }
      setActiveStyles((prev) => ({ ...prev, outdent: currentPadding <= 0 }));
    }
  };

  const handleFontSize = (size) => {
    execCommand("fontSize", size);
    const fontSizeOption = fontSizes.find((option) => option.value === size);
    if (fontSizeOption) setSelectedFontSize(fontSizeOption.label);
  };

  const handleFontStyle = (font) => {
    execCommand("fontName", font);
    setSelectedFontStyle(font);
  };

  const handleFontFormat = (format) => {
    execCommand("formatBlock", format);
    const fontFormatOption = fontFormats.find((option) => option.value === format);
    if (fontFormatOption) setSelectedFontFormat(fontFormatOption.label);
  };

  // NEW: Enhanced link handling
  const handleCreateLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url && url.trim()) {
      let finalUrl = url.trim();
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }
      editorRef.current.focus();
      const selection = window.getSelection();
      const selectedText = selection.toString();
      if (selectedText) {
        execCommand("createLink", finalUrl);
      } else {
        document.execCommand("insertHTML", false, `<a href="${finalUrl}" target="_blank">${finalUrl}</a>`);
      }
      setTimeout(() => makeLinksClickable(), 100);
    }
  };

  const makeLinksClickable = () => {
    if (!editorRef.current) return;
    const links = editorRef.current.querySelectorAll("a");
    links.forEach((link) => {
      link.removeEventListener("click", handleLinkClick);
      link.addEventListener("click", handleLinkClick);
      if (!link.getAttribute("target")) link.setAttribute("target", "_blank");
      if (!link.getAttribute("rel")) link.setAttribute("rel", "noopener noreferrer");
    });
  };

  const handleLinkClick = (e) => {
    const link = e.target;
    const currentUrl = link.href;
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const action = confirm(`Current URL: ${currentUrl}\n\nClick OK to edit this link, or Cancel to open it in a new tab.`);
    if (action) {
      const newUrl = prompt("Edit URL:", currentUrl);
      if (newUrl && newUrl.trim()) {
        let finalUrl = newUrl.trim();
        if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
          finalUrl = "https://" + finalUrl;
        }
        link.href = finalUrl;
        if (link.textContent === currentUrl) link.textContent = finalUrl;
      }
    } else {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    }
  };

  const addContextMenuToLinks = () => {
    if (!editorRef.current) return;
    const links = editorRef.current.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const menu = document.createElement("div");
        menu.className = "fixed z-50 bg-gray-800 border border-gray-600 rounded shadow-lg py-2 min-w-32";
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";

        const openOption = document.createElement("button");
        openOption.className = "block w-full text-left px-4 py-2 text-white hover:bg-gray-700";
        openOption.textContent = "Open Link";
        openOption.onclick = () => {
          window.open(link.href, "_blank", "noopener,noreferrer");
          document.body.removeChild(menu);
        };

        const editOption = document.createElement("button");
        editOption.className = "block w-full text-left px-4 py-2 text-white hover:bg-gray-700";
        editOption.textContent = "Edit Link";
        editOption.onclick = () => {
          const newUrl = prompt("Edit URL:", link.href);
          if (newUrl && newUrl.trim()) {
            let finalUrl = newUrl.trim();
            if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
              finalUrl = "https://" + finalUrl;
            }
            link.href = finalUrl;
            if (link.textContent === link.href) link.textContent = finalUrl;
          }
          document.body.removeChild(menu);
        };

        const removeOption = document.createElement("button");
        removeOption.className = "block w-full text-left px-4 py-2 text-white hover:bg-gray-700";
        removeOption.textContent = "Remove Link";
        removeOption.onclick = () => {
          const textNode = document.createTextNode(link.textContent);
          link.parentNode.replaceChild(textNode, link);
          document.body.removeChild(menu);
          setFormData((prev) => ({
            ...prev,
            content: editorRef.current.innerHTML,
          }));
        };

        menu.appendChild(openOption);
        menu.appendChild(editOption);
        menu.appendChild(removeOption);
        document.body.appendChild(menu);

        const removeMenu = (event) => {
          if (!menu.contains(event.target)) {
            document.body.removeChild(menu);
            document.removeEventListener("click", removeMenu);
          }
        };
        setTimeout(() => document.addEventListener("click", removeMenu), 100);
      });
    });
  };

  const handleInsertImage = () => {
    const url = prompt("Enter image URL:", "http://");
    if (url) {
      execCommand("insertImage", url);
      setTimeout(() => {
        const images = editorRef.current.querySelectorAll("img");
        const insertedImage = images[images.length - 1];
        if (insertedImage) {
          insertedImage.style.maxWidth = "100%";
          insertedImage.style.height = "auto";
          insertedImage.style.display = "block";
          insertedImage.style.margin = "10px 0";
        }
      }, 0);
    }
  };

  const triggerImageUpload = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };

  const initializeEditor = () => {
    const style = document.createElement("style");
    style.textContent = `
      [contenteditable] {
        outline: none;
        word-wrap: break-word;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
      [contenteditable] ul {
        display: block;
        list-style-type: disc;
        padding-left: 40px;
        margin-left: 0;
      }
      [contenteditable] ol {
        display: block;
        list-style-type: decimal;
        padding-left: 40px;
        margin-left: 0;
      }
      [contenteditable] li {
        display: list-item;
      }
      [contenteditable] img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 10px 0;
      }
      [contenteditable] a {
        color: #3b82f6;
        text-decoration: underline;
        cursor: pointer;
      }
      [contenteditable] a:hover {
        color: #1d4ed8;
        text-decoration: underline;
      }
      [contenteditable] a:visited {
        color: #7c3aed;
      }
    `;
    document.head.appendChild(style);

    if (editorRef.current && !editorRef.current.innerHTML.trim()) {
      editorRef.current.innerHTML = "<p><br></p>";
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    initializeEditor();
    initializeDefaultStyles();
    makeLinksClickable();
    editor.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) handleOutdent();
        else handleIndent();
      }
      setTimeout(updateActiveStyles, 10);
    };

    const handleSelectionChange = () => {
      if (document.activeElement === editor) updateActiveStyles();
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      setTimeout(() => makeLinksClickable(), 100);
    };

    const handleInput = () => {
      setFormData((prev) => ({
        ...prev,
        content: editor.innerHTML,
      }));
      setTimeout(() => {
        makeLinksClickable();
        addContextMenuToLinks();
      }, 100);
    };

    editor.addEventListener("keydown", handleKeyDown);
    editor.addEventListener("paste", handlePaste);
    editor.addEventListener("input", handleInput);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      editor.removeEventListener("keydown", handleKeyDown);
      editor.removeEventListener("paste", handlePaste);
      editor.removeEventListener("input", handleInput);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // UPDATED: Enhanced validation
  const handleSave = async () => {
  try {
    setIsSubmitting(true);
    const editorContent = editorRef.current ? editorRef.current.innerHTML.trim() : "";
    setTitleError("");
    setContentError("");
    let hasValidationErrors = false;

    if (!formData.title.trim()) {
      setTitleError("Policy Title is Required");
      hasValidationErrors = true;
    }

    const isContentEmpty =
      !editorContent ||
      editorContent === "<p><br></p>" ||
      editorContent === "<p></p>" ||
      editorContent === "<br>" ||
      editorContent.replace(/<[^>]*>/g, "").trim() === "";

    if (isContentEmpty) {
      setContentError("Policy content is required.");
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("title", formData.title.trim());
    apiFormData.append("text", editorContent);

    // Handle file: include newPolicy if present, or explicitly set to null if cleared
    if (formData.newPolicy) {
      apiFormData.append("energy_policy", formData.newPolicy);
    } else if (!formData.newPolicy && !formData.existingPolicy) {
      apiFormData.append("energy_policy", ""); // Send empty string to clear the file
    }

    const response = await axios.put(
      `${BASE_URL}/qms/policy/${id}/update/`,
      apiFormData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.status === 200 || response.status === 201) {
      setShowEditPolicySuccessModal(true);
      setTimeout(() => {
        setShowEditPolicySuccessModal(false);
        navigate("/company/qms/policy");
      }, 2000);
    } else {
      throw new Error("Failed to update policy");
    }
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || "An error occurred while updating the policy.";
    setErrorMessage(errorMsg);
    setShowEditPolicyErrorModal(true);
    setTimeout(() => {
      setShowEditPolicyErrorModal(false);
      setErrorMessage("");
    }, 3000);
  } finally {
    setIsSubmitting(false);
  }
};

  // NEW: Link instructions component
  const LinkInstructions = () => (
    <div className="text-xs text-gray-400 mb-2">
      💡 Tip: Click on links to open or edit them. Right-click for more options.
    </div>
  );

  // UPDATED: Dropdown with tooltips
  const Dropdown = ({ title, options, onSelect, selectedValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const displayTitle = selectedValue || title;

    return (
      <div className="relative">
        <button
          className="px-2 py-1 bg-transparent border border-[#AAAAAA] rounded flex items-center custom-fonts"
          onClick={() => setIsOpen(!isOpen)}
          title={title}
        >
          {displayTitle}{" "}
          <span className="ml-1">
            <ChevronDown size={15} />
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-40 bg-[#1C1C24] border border-[#AAAAAA] rounded shadow-lg">
            {options.map((option, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-1 hover:bg-gray-700 custom-fonts"
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                title={option.tooltip} // NEW: Tooltip for options
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ColorPickerPanel = ({ onColorSelect, activeColor }) => {
    const [customColor, setCustomColor] = useState(activeColor);
    return (
      <div
        className="absolute z-20 mt-2 p-3 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg"
        ref={colorPickerRef}
      >
        <div className="grid grid-cols-5 gap-2 mb-3">
          {colorPalette.map((color, index) => (
            <button
              key={index}
              className={`w-6 h-6 rounded-sm border ${color === activeColor ? "border-blue-500" : "border-gray-600"}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
          />
          <div className="flex-1 text-xs text-gray-400">Custom</div>
          <button
            className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700"
            onClick={() => onColorSelect(customColor)}
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-[8px]">
      <h1 className="add-policy-head">Edit Policy</h1>
      <EditQmsPolicySuccessModal
        showEditPolicySuccessModal={showEditPolicySuccessModal}
        onClose={() => setShowEditPolicySuccessModal(false)}
      />
      <EditQmsPolicyErrorModal
        showEditPolicyErrorModal={showEditPolicyErrorModal}
        onClose={() => {
          setShowEditPolicyErrorModal(false);
          setErrorMessage("");
        }}
        errorMessage={errorMessage}
      />
      <div className="border-t border-[#383840] mt-[21px] mb-5"></div>

      {/* Title Field */}
      <div className="mb-5">
        <label htmlFor="policyTitle" className="block add-qms-manual-label">
          Policy Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="policyTitle"
          value={formData.title}
          onChange={handleTitleChange}
          className={`add-qms-manual-inputs ${titleError ? "border-red-500" : ""}`}
          placeholder="Enter policy title"
          maxLength={50}
        />
        {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
        <p className="text-xs text-gray-400 mt-1">Enter a concise title for the policy (max 50 characters).</p>
      </div>

      <div className="flex items-center bg-[#24242D] justify-between px-5 py-[13px] rounded-[4px] mb-4">
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.bold ? "bg-gray-700" : ""}`}
          onClick={() => execCommand("bold")}
          title="Bold"
        >
          <img src={bold} alt="Bold" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.italic ? "bg-gray-700" : ""}`}
          onClick={() => execCommand("italic")}
          title="Italic"
        >
          <img src={itallic} alt="Italic" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.underline ? "bg-gray-700" : ""}`}
          onClick={() => execCommand("underline")}
          title="Underline"
        >
          <img src={underline} alt="Underline" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.align === "left" ? "bg-gray-700" : ""}`}
          onClick={() => execCommand("justifyLeft")}
          title="Align Left"
        >
          <img src={leftalign} alt="Text Left Align" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.align === "center" ? "bg-gray-700" : ""}`}
          onClick={() => execCommand("justifyCenter")}
          title="Align Center"
        >
          <img src={centeralign} alt="Text Center Align" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.align === "right" ? "bg-gray-700" : ""}`}
          onClick={() => execCommand("justifyRight")}
          title="Align Right"
        >
          <img src={rightalign} alt="Text Right Align" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.align === "justify" ? "bg-gray-700" : ""}`}
          onClick={() => execCommand("justifyFull")}
          title="Justify"
        >
          <img src={sentencetext} alt="Align Justify" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.orderedList ? "bg-gray-700" : ""}`}
          onClick={() => handleList("ol")}
          title="Ordered List"
        >
          <img src={orderedlist} alt="Ordered List" />
        </button>
        <button
          className={`p-1 mx-1 hover:bg-gray-700 rounded ${activeStyles.unorderedList ? "bg-gray-700" : ""}`}
          onClick={() => handleList("ul")}
          title="Unordered List"
        >
          <img src={unorderedlist} alt="Unordered List" />
        </button>
        <div className="flex">
          <div className="flex items-center mr-[10px]">
            <Dropdown
              title="Font Size"
              options={fontSizes}
              onSelect={handleFontSize}
              selectedValue={selectedFontSize}
            />
          </div>
          <div className="flex items-center mr-[10px]">
            <Dropdown
              title="Font Style"
              options={fontStyles}
              onSelect={handleFontStyle}
              selectedValue={selectedFontStyle}
            />
          </div>
          <div className="flex items-center">
            <Dropdown
              title="Font Format"
              options={fontFormats}
              onSelect={handleFontFormat}
              selectedValue={selectedFontFormat}
            />
          </div>
        </div>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={handleIndent} title="Indent">
          <img src={textoutdent} alt="Text Indent" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={handleOutdent} title="Outdent">
          <img src={textindednt} alt="Text Outdent" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={handleInsertImage} title="Insert Image from URL">
          <img src={imagelink} alt="Insert Image" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={triggerImageUpload} title="Upload Image">
          <img src={imageupload} alt="Upload Image" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={handleCreateLink} title="Insert Link">
          <img src={addlinks} alt="Add Link" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={() => execCommand("unlink")} title="Remove Link">
          <img src={removelinks} alt="Remove Link" />
        </button>
        <div className="relative">
          <button
            className="p-1 mx-1 hover:bg-gray-700 rounded relative"
            onClick={toggleTextColorPicker}
            title="Text Color"
            style={{ color: activeStyles.textColor }}
          >
            <img src={textcolor} alt="Text Color" />
          </button>
          {showTextColorPicker && (
            <ColorPickerPanel onColorSelect={handleTextColor} activeColor={activeStyles.textColor} />
          )}
        </div>
        <div className="relative">
          <button
            className="p-1 mx-1 hover:bg-gray-700 rounded"
            onClick={toggleBgColorPicker}
            title="Background Color"
          >
            <img
              src={textbgcolor}
              style={{ color: activeStyles.bgColor !== "transparent" ? activeStyles.bgColor : undefined }}
            />
          </button>
          {showBgColorPicker && (
            <ColorPickerPanel onColorSelect={handleBackgroundColor} activeColor={activeStyles.bgColor} />
          )}
        </div>
      </div>
      <LinkInstructions />
      <div className="rounded-md mb-6">
        <label className="block add-qms-manual-label mb-2">
          Policy Content <span className="text-red-500">*</span>
        </label>
        <div
          ref={editorRef}
          contentEditable
          className={`bg-[#24242D] px-5 py-[16px] min-h-[300px] focus:outline-none rounded-[4px] ${contentError ? "border border-red-500" : ""}`}
          onInput={() => {
            setFormData((prev) => ({ ...prev, content: editorRef.current.innerHTML }));
            setContentError("");
            setTimeout(() => {
              makeLinksClickable();
              addContextMenuToLinks();
            }, 100);
          }}
        />
        {contentError && <p className="text-red-500 text-sm mt-1">{contentError}</p>}
        <p className="text-xs text-gray-400 mt-1">Enter the detailed policy content using the formatting tools above.</p>
      </div>
      <div className="flex items-center justify-between mt-8 mb-[23px]">
        <label className="attach-policy-text">Attach Quality Policy:</label>
        <div className="flex items-center">
          <button
            className="flex items-center text-[#1E84AF] gap-2 mr-3 click-view-file-btn"
            onClick={handleViewFile}
          >
            Click to view file
            <Eye size={18} className="text-[#1E84AF]" />
          </button>
          <label className="flex justify-center gap-[10px] items-center w-[326px] h-[44px] px-[10px] text-[#AAAAAA] rounded-md border border-[#383840] cursor-pointer transition">
            Choose File
            <img src={files} alt="File Icon" />
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </label>
          <div className="mt-1 ml-2 text-sm text-[#54545B]">
            {formData.newPolicy ? formData.newPolicy.name : formData.existingPolicy ? formData.existingPolicy.name : "No file chosen"}
          </div>
          {(formData.newPolicy || formData.existingPolicy) && (
            <button
              className="ml-2 px-2 py-1 text-[#AAAAAA] text-xl font-bold"
              onClick={handleClearFile}
              title="Clear selected file"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-[#383840] mb-8"></div>
      <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: "none" }} />
      <div className="flex justify-end gap-[21px]">
        <button className="cancel-btn duration-200" onClick={() => navigate("/company/qms/policy")}>
          Cancel
        </button>
        <button className="save-btn duration-200" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default EditQmsPolicy;