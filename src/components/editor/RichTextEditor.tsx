import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, ListOrdered, List, Quote, Image, Link } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder
}: RichTextEditorProps) {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleCommand = (command: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    textarea.focus();
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newValue = value;
    let newCursorPosition = end;
    
    // Calculate the line start to properly apply heading markdown
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    // Check if line already has heading markdown
    const currentLine = value.substring(lineStart, Math.max(lineStart, end));
    const lineAlreadyHasHeading = /^(#{1,6})\s/.test(currentLine);
    
    switch (command) {
      case 'bold':
        newValue = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newCursorPosition = end + 4;
        break;
      case 'italic':
        newValue = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        newCursorPosition = end + 2;
        break;
      case 'underline':
        newValue = value.substring(0, start) + `<u>${selectedText}</u>` + value.substring(end);
        newCursorPosition = end + 7;
        break;
      case 'h1':
        if (lineAlreadyHasHeading) {
          // Replace existing heading
          newValue = value.substring(0, lineStart) + 
                    `# ${currentLine.replace(/^#{1,6}\s/, '')}` + 
                    value.substring(Math.max(lineStart, end));
        } else {
          // Add new heading at line start
          newValue = value.substring(0, lineStart) + 
                    `# ${selectedText || value.substring(lineStart, end)}` + 
                    value.substring(end);
        }
        break;
      case 'h2':
        if (lineAlreadyHasHeading) {
          newValue = value.substring(0, lineStart) + 
                    `## ${currentLine.replace(/^#{1,6}\s/, '')}` + 
                    value.substring(Math.max(lineStart, end));
        } else {
          newValue = value.substring(0, lineStart) + 
                    `## ${selectedText || value.substring(lineStart, end)}` + 
                    value.substring(end);
        }
        break;
      case 'h3':
        if (lineAlreadyHasHeading) {
          newValue = value.substring(0, lineStart) + 
                    `### ${currentLine.replace(/^#{1,6}\s/, '')}` + 
                    value.substring(Math.max(lineStart, end));
        } else {
          newValue = value.substring(0, lineStart) + 
                    `### ${selectedText || value.substring(lineStart, end)}` + 
                    value.substring(end);
        }
        break;
      case 'h4':
        if (lineAlreadyHasHeading) {
          newValue = value.substring(0, lineStart) + 
                    `#### ${currentLine.replace(/^#{1,6}\s/, '')}` + 
                    value.substring(Math.max(lineStart, end));
        } else {
          newValue = value.substring(0, lineStart) + 
                    `#### ${selectedText || value.substring(lineStart, end)}` + 
                    value.substring(end);
        }
        break;
      case 'h5':
        if (lineAlreadyHasHeading) {
          newValue = value.substring(0, lineStart) + 
                    `##### ${currentLine.replace(/^#{1,6}\s/, '')}` + 
                    value.substring(Math.max(lineStart, end));
        } else {
          newValue = value.substring(0, lineStart) + 
                    `##### ${selectedText || value.substring(lineStart, end)}` + 
                    value.substring(end);
        }
        break;
      case 'h6':
        if (lineAlreadyHasHeading) {
          newValue = value.substring(0, lineStart) + 
                    `###### ${currentLine.replace(/^#{1,6}\s/, '')}` + 
                    value.substring(Math.max(lineStart, end));
        } else {
          newValue = value.substring(0, lineStart) + 
                    `###### ${selectedText || value.substring(lineStart, end)}` + 
                    value.substring(end);
        }
        break;
      case 'ol':
        newValue = value.substring(0, start) + `1. ${selectedText}` + value.substring(end);
        newCursorPosition = end + 3;
        break;
      case 'ul':
        newValue = value.substring(0, start) + `- ${selectedText}` + value.substring(end);
        newCursorPosition = end + 2;
        break;
      case 'quote':
        newValue = value.substring(0, start) + `> ${selectedText}` + value.substring(end);
        newCursorPosition = end + 2;
        break;
      case 'link':
        newValue = value.substring(0, start) + `[${selectedText}](url)` + value.substring(end);
        newCursorPosition = end + 7;
        break;
      case 'image':
        newValue = value.substring(0, start) + `![${selectedText}](image_url)` + value.substring(end);
        newCursorPosition = end + 13;
        break;
      default:
        break;
    }
    
    onChange(newValue);
    
    setTimeout(() => {
      textarea.selectionStart = command === 'link' ? end + 1 : start;
      textarea.selectionEnd = command === 'link' ? end + selectedText.length + 1 : newCursorPosition;
    }, 0);
  };
  
  return (
    <div className="space-y-2">
      <div className="bg-white border rounded-t-lg border-gray-200 p-2 flex flex-wrap gap-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('underline')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" title="Headings">
              <Heading2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-3 gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCommand('h1')}
                className="text-base font-bold"
              >
                H1
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCommand('h2')}
                className="text-base font-bold"
              >
                H2
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCommand('h3')}
                className="text-base font-bold"
              >
                H3
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCommand('h4')}
                className="text-sm font-bold"
              >
                H4
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCommand('h5')}
                className="text-xs font-bold"
              >
                H5
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCommand('h6')}
                className="text-xs font-bold"
              >
                H6
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('ol')}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('ul')}
          title="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('quote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('link')}
          title="Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => handleCommand('image')}
          title="Image"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-[500px] rounded-t-none ${className}`}
        placeholder={placeholder}
        onSelect={() => {
          if (textareaRef.current) {
            setSelection({
              start: textareaRef.current.selectionStart,
              end: textareaRef.current.selectionEnd
            });
          }
        }}
      />
    </div>
  );
}
