import React, { useRef, useState, useEffect } from "react";
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
import { ChevronDown } from "lucide-react";
import axios from "axios";
import "./addqmspolicys.css";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../../../Utils/Config";
import { useNavigate } from "react-router-dom";
import AddQmsPolicySuccessModal from "./Modals/AddQmsPolicySuccessModal";
import AddQmsPolicyErrorModal from "./Modals/AddQmsPolicyErrorModal";

const AddQmsPolicy = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    energyPolicy: null,
  });

  const [titleError, setTitleError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddPolicySuccessModal, setShowAddPolicySuccessModal] = useState(false);
  const [showAddPolicyErrorModal, setShowAddPolicyErrorModal] = useState(false);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null); // Added ref for file input
  const imageInputRef = useRef(null);
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
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
    "#C0C0C0",
    "#808080",
    "#800000",
    "#808000",
    "#008000",
    "#800080",
    "#008080",
    "#000080",
    "#FFA500",
    "#A52A2A",
    "#F5F5DC",
    "#FFD700",
  ];

  // Font options with tooltips
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

  // Add state for selected dropdown values
  const [selectedFontSize, setSelectedFontSize] = useState(fontSizes[1].label); // 'Normal'
  const [selectedFontStyle, setSelectedFontStyle] = useState(fontStyles[0].label); // 'Arial'
  const [selectedFontFormat, setSelectedFontFormat] = useState(fontFormats[0].label); // 'Paragraph'

  // Handle file selection for policy attachment
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        energyPolicy: file,
      });
    }
  };

  // Handle clearing selected file
  const handleClearFile = () => {
    setFormData({
      ...formData,
      energyPolicy: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
    setTitleError(""); // Clear error when user types
  };

  // Handle image upload for the editor
  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // Only process image files
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Create a FileReader to read the image
      const reader = new FileReader();

      reader.onload = (event) => {
        // Get the image data URL
        const imageUrl = event.target.result;

        // Focus the editor
        editorRef.current.focus();

        // Insert the image at the current cursor position
        document.execCommand("insertImage", false, imageUrl);

        // Apply some basic styling to the image
        setTimeout(() => {
          const images = editorRef.current.querySelectorAll("img");
          const insertedImage = images[images.length - 1];

          if (insertedImage) {
            // Set reasonable max dimensions while maintaining aspect ratio
            insertedImage.style.maxWidth = "100%";
            insertedImage.style.height = "auto";
            insertedImage.style.display = "block";
            insertedImage.style.margin = "10px 0";
          }
        }, 0);
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);

      // Clear the input to allow selecting the same file again
      e.target.value = null;
    }
  };

  // Initialize the editor with default formatting
  const initializeDefaultStyles = () => {
    if (!editorRef.current) return;

    // Focus the editor
    editorRef.current.focus();

    // Set default font style
    document.execCommand("fontName", false, fontStyles[0].value);

    // Set default font size
    document.execCommand("fontSize", false, fontSizes[1].value);

    // Set default format block
    document.execCommand("formatBlock", false, fontFormats[0].value);
  };

  // Apply formatting to the text
  const execCommand = (command, value = null) => {
    // Make sure editor has focus before executing command
    if (editorRef.current) {
      editorRef.current.focus();

      // Execute the command
      document.execCommand(command, false, value);

      // Special handling for list commands which can be finicky
      if (command === "insertUnorderedList" || command === "insertOrderedList") {
        // Force update after a short delay to ensure command is applied
        setTimeout(() => {
          updateActiveStyles();
        }, 10);
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

  // Trigger color picker for text color
  const toggleTextColorPicker = () => {
    setShowTextColorPicker(!showTextColorPicker);
    setShowBgColorPicker(false);
  };

  // Trigger color picker for background color
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update active styles based on current selection
  const updateActiveStyles = () => {
    if (document.activeElement !== editorRef.current) return;

    // Check format block state
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
      indent: false, // No direct state for indent
      outdent: false, // No direct state for outdent
      formatBlock: formatBlock || "p",
      textColor: textColor || "#FFFFFF",
      bgColor: bgColor || "transparent",
    });

    // Update selected format
    if (formatBlock) {
      const fontFormatOption = fontFormats.find((option) => option.value === formatBlock);
      if (fontFormatOption) {
        setSelectedFontFormat(fontFormatOption.label);
      }
    }

    // Update font style
    const fontName = document.queryCommandValue("fontName");
    if (fontName) {
      // Check if it's a system font stack or one of our defined fonts
      const matchedFont = fontStyles.find(
        (font) => fontName.includes(font.value) || font.value === fontName
      );

      if (matchedFont) {
        setSelectedFontStyle(matchedFont.label);
      } else if (fontName.includes(",")) {
        // Handle system font stack by displaying the first font in the stack
        const firstFont = fontName.split(",")[0].trim().replace(/"/g, "");
        setSelectedFontStyle(firstFont);
      } else {
        setSelectedFontStyle(fontName);
      }
    }

    // Update font size
    const fontSize = document.queryCommandValue("fontSize");
    if (fontSize) {
      const fontSizeOption = fontSizes.find((option) => option.value === fontSize);
      if (fontSizeOption) {
        setSelectedFontSize(fontSizeOption.label);
      }
    }
  };

  // Enhanced list creation with fixed bullet/number visibility
  const createList = (type) => {
    // Ensure we have focus
    editorRef.current.focus();

    // Determine the command to execute
    const command = type === "ul" ? "insertUnorderedList" : "insertOrderedList";

    // Execute the list command
    document.execCommand(command, false, null);

    // Fix list styling after creation
    setTimeout(() => {
      // Find all lists in the editor and ensure they have proper styling
      const lists = editorRef.current.querySelectorAll("ul, ol");

      lists.forEach((list) => {
        // Make sure list has the correct display and list-style properties
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

        // Ensure list items also have proper styling
        const items = list.querySelectorAll("li");
        items.forEach((item) => {
          item.style.display = "list-item";
        });
      });

      updateActiveStyles();
    }, 10);
  };

  // Handle specialized list functionality
  const handleList = (type) => {
    createList(type);
  };

  // Improved indent/outdent handlers
  const handleIndent = () => {
    // Focus the editor
    editorRef.current.focus();

    // Get selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Try to find the closest list item
    let currentNode = range.commonAncestorContainer;

    // If we're in a text node, get its parent
    if (currentNode.nodeType === 3) {
      currentNode = currentNode.parentNode;
    }

    // See if we're in a list item
    let listItem = null;
    while (currentNode && currentNode !== editorRef.current) {
      if (currentNode.nodeName === "LI") {
        listItem = currentNode;
        break;
      }
      currentNode = currentNode.parentNode;
    }

    // If we're in a list item, we can use the built-in indent
    if (listItem) {
      execCommand("indent");
    } else {
      // Otherwise, apply padding to create indentation effect
      // This works for paragraphs and other block elements
      execCommand("formatBlock", "<div>");
      const selectedElement = document.getSelection().anchorNode.parentNode;

      // Add indentation through inline style
      const currentPadding = parseInt(selectedElement.style.paddingLeft || "0");
      selectedElement.style.paddingLeft = currentPadding + 40 + "px";

      setActiveStyles((prev) => ({ ...prev, indent: true }));
    }
  };

  const handleOutdent = () => {
    // Focus the editor
    editorRef.current.focus();

    // Get selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Try to find the closest list item
    let currentNode = range.commonAncestorContainer;

    // If we're in a text node, get its parent
    if (currentNode.nodeType === 3) {
      currentNode = currentNode.parentNode;
    }

    // See if we're in a list item
    let listItem = null;
    while (currentNode && currentNode !== editorRef.current) {
      if (currentNode.nodeName === "LI") {
        listItem = currentNode;
        break;
      }
      currentNode = currentNode.parentNode;
    }

    // If we're in a list item, we can use the built-in outdent
    if (listItem) {
      execCommand("outdent");
    } else {
      // Otherwise, reduce padding to create outdentation effect
      const selectedElement = document.getSelection().anchorNode.parentNode;

      // Reduce indentation through inline style
      const currentPadding = parseInt(selectedElement.style.paddingLeft || "0");
      if (currentPadding > 0) {
        selectedElement.style.paddingLeft = Math.max(0, currentPadding - 40) + "px";
      }

      setActiveStyles((prev) => ({ ...prev, outdent: currentPadding <= 0 }));
    }
  };

  // Updated dropdown handlers to set selected state
  const handleFontSize = (size) => {
    execCommand("fontSize", size);

    // Update the selected font size title based on size value
    const fontSizeOption = fontSizes.find((option) => option.value === size);
    if (fontSizeOption) {
      setSelectedFontSize(fontSizeOption.label);
    }
  };

  const handleFontStyle = (font) => {
    execCommand("fontName", font);
    setSelectedFontStyle(font);
  };

  const handleFontFormat = (format) => {
    execCommand("formatBlock", format);

    // Update the selected format title based on format value
    const fontFormatOption = fontFormats.find((option) => option.value === format);
    if (fontFormatOption) {
      setSelectedFontFormat(fontFormatOption.label);
    }
  };

  const handleCreateLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url && url.trim()) {
      // Ensure the URL has a protocol
      let finalUrl = url.trim();
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }

      // Focus the editor first
      editorRef.current.focus();

      // Get the current selection
      const selection = window.getSelection();
      const selectedText = selection.toString();

      if (selectedText) {
        // If text is selected, create link with selected text
        execCommand("createLink", finalUrl);
      } else {
        // If no text is selected, insert the URL as both text and link
        document.execCommand("insertHTML", false, `<a href="${finalUrl}" target="_blank">${finalUrl}</a>`);
      }

      // Update the links to be clickable
      setTimeout(() => {
        makeLinksClickable();
      }, 100);
    }
  };

  const makeLinksClickable = () => {
    if (!editorRef.current) return;

    const links = editorRef.current.querySelectorAll("a");
    links.forEach((link) => {
      // Remove any existing click handlers to avoid duplicates
      link.removeEventListener("click", handleLinkClick);

      // Add click handler
      link.addEventListener("click", handleLinkClick);

      // Ensure the link has proper attributes
      if (!link.getAttribute("target")) {
        link.setAttribute("target", "_blank");
      }
      if (!link.getAttribute("rel")) {
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  const handleLinkClick = (e) => {
    const link = e.target;
    const currentUrl = link.href;

    // Allow default navigation for regular clicks
    if (!e.ctrlKey && !e.metaKey) {
      // Let the browser handle the navigation
      return;
    }

    // For Ctrl/Cmd + click, show edit/open options
    e.preventDefault();
    const action = confirm(`Current URL: ${currentUrl}\n\nClick OK to edit this link, or Cancel to open it in a new tab.`);
    if (action) {
      // Edit link
      const newUrl = prompt("Edit URL:", currentUrl);
      if (newUrl && newUrl.trim()) {
        let finalUrl = newUrl.trim();
        if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
          finalUrl = "https://" + finalUrl;
        }
        link.href = finalUrl;
        if (link.textContent === currentUrl) {
          link.textContent = finalUrl;
        }
      }
    } else {
      // Open in new tab
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
            if (link.textContent === link.href) {
              link.textContent = finalUrl;
            }
          }
          document.body.removeChild(menu);
        };

        const removeOption = document.createElement("button");
        removeOption.className = "block w-full text-left px-4 py-2 text-white hover:bg-gray-700";
        removeOption.textContent = "Remove Link";
        removeOption.onclick = () => {
          // Replace link with just its text content
          const textNode = document.createTextNode(link.textContent);
          link.parentNode.replaceChild(textNode, link);
          document.body.removeChild(menu);

          // Trigger content change
          setFormData((prev) => ({
            ...prev,
            content: editorRef.current.innerHTML,
          }));
        };

        menu.appendChild(openOption);
        menu.appendChild(editOption);
        menu.appendChild(removeOption);

        document.body.appendChild(menu);

        // Remove menu when clicking elsewhere
        const removeMenu = (event) => {
          if (!menu.contains(event.target)) {
            document.body.removeChild(menu);
            document.removeEventListener("click", removeMenu);
          }
        };

        setTimeout(() => {
          document.addEventListener("click", removeMenu);
        }, 100);
      });
    });
  };

  // Handle inserting image via URL
  const handleInsertImage = () => {
    const url = prompt("Enter image URL:", "http://");
    if (url) {
      execCommand("insertImage", url);

      // Apply styling to the inserted image
      setTimeout(() => {
        const images = editorRef.current.querySelectorAll("img");
        const insertedImage = images[images.length - 1];

        if (insertedImage) {
          // Set reasonable max dimensions while maintaining aspect ratio
          insertedImage.style.maxWidth = "100%";
          insertedImage.style.height = "auto";
          insertedImage.style.display = "block";
          insertedImage.style.margin = "10px 0";
        }
      }, 0);
    }
  };

  // Trigger file input click for image upload
  const triggerImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  // Initialize the editor with CSS styling for lists
  const initializeEditor = () => {
    // Add a stylesheet for the editor
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

    // Ensure the editor has proper styling
    if (editorRef.current) {
      // Set content to ensure proper initialization (if empty)
      if (!editorRef.current.innerHTML.trim()) {
        editorRef.current.innerHTML = "<p><br></p>";
      }
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Initialize editor with proper styling
    initializeEditor();

    // Initialize default formatting
    initializeDefaultStyles();

    // Make existing links clickable
    makeLinksClickable();

    // Set initial focus to help with command state detection
    editor.focus();

    const handleKeyDown = (e) => {
      // Check for Tab key for indentation within lists
      if (e.key === "Tab") {
        // Prevent default tab behavior
        e.preventDefault();

        // If we're in a list, apply indent/outdent
        if (e.shiftKey) {
          // Shift+Tab for outdent
          handleOutdent();
        } else {
          // Tab for indent
          handleIndent();
        }
      }

      // Update styles after key operations
      setTimeout(updateActiveStyles, 10);
    };

    // Handle selection changes
    const handleSelectionChange = () => {
      if (document.activeElement === editor) {
        updateActiveStyles();
      }
    };

    // Handle paste events to preserve list formatting
    const handlePaste = (e) => {
      e.preventDefault();

      // Get text representation of clipboard
      const text = e.clipboardData.getData("text/plain");

      // Insert as plain text (preserving line breaks)
      document.execCommand("insertText", false, text);

      // Make any new links clickable
      setTimeout(() => {
        makeLinksClickable();
      }, 100);
    };

    // Handle input events to make new links clickable
    const handleInput = () => {
      // Update form data
      setFormData((prev) => ({
        ...prev,
        content: editor.innerHTML,
      }));

      // Make any new links clickable
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

  const handleCancel = () => {
    // Reset form data
    setFormData({
      title: "",
      content: "",
      energyPolicy: null,
    });

    // Clear editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = "<p><br></p>";
    }

    navigate("/company/qms/policy");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const company_id = localStorage.getItem("company_id");
    const user_id = localStorage.getItem("user_id");

    console.log("Logged-in User ID:", user_id);
    console.log("Logged-in Company ID:", company_id);
    console.log("User Role:", role);

    if (!accessToken || !role || (!company_id && !user_id)) {
      console.warn("Some values are missing from localStorage!");
    }
  }, []);

  const getUserCompanyId = () => {
    // First check if company_id is stored directly
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;

    // If user data exists with company_id
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      // Try to get company_id from user data that was stored during login
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

  // Enhanced validation for mandatory fields in handleSave function
  const handleSave = async () => {
    const editorContent = editorRef.current ? editorRef.current.innerHTML : "";

    // Reset any previous errors
    setTitleError("");
    setErrorMessage("");

    let hasValidationErrors = false;

    // Check if title is empty or only whitespace
    if (!formData.title.trim()) {
      setTitleError("Policy Title is Required");
      hasValidationErrors = true;
    }

    // Enhanced content validation - check for meaningful content
    const isContentEmpty =
      !editorContent.trim() ||
      editorContent === "<p><br></p>" ||
      editorContent === "<p></p>" ||
      editorContent === "<br>" ||
      editorContent.replace(/<[^>]*>/g, "").trim() === "";

    if (isContentEmpty) {
      setErrorMessage("Policy content is required.");
      setShowAddPolicyErrorModal(true);
      setTimeout(() => {
        setShowAddPolicyErrorModal(false);
        setErrorMessage("");
      }, 3000);
      hasValidationErrors = true;
    }

    // If there are validation errors, stop execution
    if (hasValidationErrors) {
      return;
    }

    try {
      setIsSaving(true);
      const companyId = getUserCompanyId();

      if (!companyId) {
        setErrorMessage("Company ID not found.");
        setShowAddPolicyErrorModal(true);
        setTimeout(() => {
          setShowAddPolicyErrorModal(false);
          setErrorMessage("");
        }, 3000);
        setIsSaving(false);
        return;
      }

      const apiFormData = new FormData();
      apiFormData.append("title", formData.title.trim()); // Trim whitespace
      apiFormData.append("text", editorContent);
      apiFormData.append("company", companyId);

      if (formData.energyPolicy) {
        apiFormData.append("energy_policy", formData.energyPolicy);
      }

      const response = await axios.post(`${BASE_URL}/qms/policy/`, apiFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && (response.status === 200 || response.status === 201)) {
        setShowAddPolicySuccessModal(true);
        setTimeout(() => {
          setShowAddPolicySuccessModal(false);
          navigate("/company/qms/policy");
          resetForm();
        }, 1500);
      } else {
        setErrorMessage("Failed to save policy. Please try again.");
        setShowAddPolicyErrorModal(true);
        setTimeout(() => {
          setShowAddPolicyErrorModal(false);
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.date?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "An error occurred while saving the policy.";
      setErrorMessage(errorMsg);
      setShowAddPolicyErrorModal(true);
      setTimeout(() => {
        setShowAddPolicyErrorModal(false);
        setErrorMessage("");
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // New function to reset the form
  const resetForm = () => {
    // Reset form data
    setFormData({
      title: "",
      content: "",
      energyPolicy: null,
    });

    // Clear editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = "<p><br></p>";
    }
  };

  const LinkInstructions = () => (
    <div className="text-xs text-gray-400 mb-2">
      💡 Tip: Click on links to open or edit them. Right-click for more options.
    </div>
  );

  // Dropdown component to show selected option
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
                title={option.tooltip} // Add tooltip to each option
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Color picker component
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
              className={`w-6 h-6 rounded-sm border ${color === activeColor ? "border-blue-500" : "border-gray-600"
                }`}
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
      <h1 className="add-policy-head">Add Policies</h1>

      <AddQmsPolicySuccessModal
        showAddPolicySuccessModal={showAddPolicySuccessModal}
        onClose={() => {
          setShowAddPolicySuccessModal(false);
        }}
      />

      <AddQmsPolicyErrorModal
        showAddPolicyErrorModal={showAddPolicyErrorModal}
        onClose={() => {
          setShowAddPolicyErrorModal(false);
        }}
        errorMessage={errorMessage}
      />

      <div className="border-t border-[#383840] mt-[21px] mb-5"></div>

      {/* Title Field */}
      <div className="mb-4">
        <label htmlFor="policyTitle" className="block add-qms-manual-label">
          Policy Title
        </label>
        <input
          type="text"
          id="policyTitle"
          value={formData.title}
          onChange={handleTitleChange}
          className={`add-qms-manual-inputs ${titleError ? "border-red-500" : ""}`}
          placeholder="Enter Policy Title"
          maxLength={50}
        />
        {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
      </div>

      <div className="flex items-center bg-[#24242D] justify-between px-5 py-[13px] rounded-[4px] mb-4">
        {/* Text formatting */}
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

        {/* Alignment */}
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

        {/* Font dropdowns */}
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

        {/* Lists and indentation */}
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={handleIndent} title="Indent">
          <img src={textoutdent} alt="Text Indent" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={handleOutdent} title="Outdent">
          <img src={textindednt} alt="Text Outdent" />
        </button>
        <button
          className="p-1 mx-1 hover:bg-gray-700 rounded"
          onClick={handleInsertImage}
          title="Insert Image from URL"
        >
          <img src={imagelink} alt="Insert Image" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={triggerImageUpload} title="Upload Image">
          <img src={imageupload} alt="Upload Image" />
        </button>

        {/* Links */}
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={handleCreateLink} title="Insert Link">
          <img src={addlinks} alt="Add Link" />
        </button>
        <button className="p-1 mx-1 hover:bg-gray-700 rounded" onClick={() => execCommand("unlink")} title="Remove Link">
          <img src={removelinks} alt="Remove Link" />
        </button>

        {/* Color pickers */}
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
              style={{
                color: activeStyles.bgColor !== "transparent" ? activeStyles.bgColor : undefined,
              }}
            />
          </button>
          {showBgColorPicker && (
            <ColorPickerPanel onColorSelect={handleBackgroundColor} activeColor={activeStyles.bgColor} />
          )}
        </div>
      </div>
      <LinkInstructions />
      <div className="rounded-md mb-6">
        {/* Editor Content Area */}
        <div
          ref={editorRef}
          contentEditable
          className="bg-[#24242D] px-5 py-[16px] min-h-[300px] focus:outline-none rounded-[4px]"
          onInput={() => {
            setFormData((prev) => ({
              ...prev,
              content: editorRef.current.innerHTML,
            }));
            setTimeout(() => {
              makeLinksClickable();
              addContextMenuToLinks();
            }, 100);
          }}
        />
      </div>

      {/* File Upload Section */}
      <div className="flex items-center justify-between mt-8 mb-[23px]">
        <label className="attach-policy-text">Attach Quality Policy:</label>
        <div className="flex items-center">
          <label className="flex justify-center gap-[10px] items-center w-[326px] h-[44px] px-[10px] text-[#AAAAAA] rounded-md border border-[#383840] cursor-pointer transition">
            Choose File
            <img src={files} alt="File Icon" />
            <input
              type="file"
              className="hidden"
              ref={fileInputRef} // Add ref to file input
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </label>
          <div className="mt-1 ml-2 text-sm text-[#54545B]">
            {formData.energyPolicy?.name ? formData.energyPolicy.name : "No file chosen"}
          </div>
          {formData.energyPolicy && (
            <button
              className="ml-2 px-2 py-1 text-[#AAAAAA]   text-xl font-bold"
              onClick={handleClearFile}
              title="Clear selected file"
            >
              &times;
            </button>

          )}
        </div>
      </div>

      <div className="border-t border-[#383840] mb-8"></div>

      {/* Hidden input for image upload */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-[21px]">
        <button className="cancel-btn duration-200" onClick={handleCancel}>
          Cancel
        </button>
        <button className="save-btn duration-200" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Policy"}
        </button>
      </div>
    </div>
  );
};

export default AddQmsPolicy;