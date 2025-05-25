import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, Heading2, ListOrdered, List, Quote, Image, Link } from "lucide-react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix: string = '', newLine: boolean = false) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    if (newLine) {
      // For headings, we want to work with the entire line
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', end);
      const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
      const currentLine = value.substring(lineStart, actualLineEnd);
      
      // Remove existing heading markup if present
      const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
      const beforeLine = value.substring(0, lineStart);
      const afterLine = value.substring(actualLineEnd);
      
      newText = beforeLine + prefix + cleanLine + afterLine;
    } else {
      newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    }
    
    console.log('insertMarkdown - newText before onChange:', newText);
    onChange(newText);
    
    // Set cursor position after the change
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (newLine) {
          const newPosition = start + prefix.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        } else {
          const newPosition = start + prefix.length + selectedText.length + suffix.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }
    }, 0);
  };

  const handleHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertMarkdown(prefix, '', true);
  };

  return (
    <div className="space-y-2">
      <div className="bg-white border rounded-t-lg border-gray-200 p-2 flex flex-wrap gap-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('<u>', '</u>')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" title="Headings">
              <Heading2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleHeading(1)}
                className="text-left justify-start font-bold text-2xl"
              >
                H1 Heading
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleHeading(2)}
                className="text-left justify-start font-bold text-xl"
              >
                H2 Heading
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleHeading(3)}
                className="text-left justify-start font-bold text-lg"
              >
                H3 Heading
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleHeading(4)}
                className="text-left justify-start font-semibold"
              >
                H4 Heading
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleHeading(5)}
                className="text-left justify-start font-semibold text-sm"
              >
                H5 Heading
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleHeading(6)}
                className="text-left justify-start font-semibold text-xs"
              >
                H6 Heading
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('1. ')}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('- ')}
          title="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('> ')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => insertMarkdown('![', '](image_url)')}
          title="Image"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-[500px] rounded-t-none font-mono ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
