import React, { useRef, useState } from 'react';

export default function RichTextEditor({ value, onChange, placeholder }) {
    const textareaRef = useRef(null);
    const [cursorPos, setCursorPos] = useState(0);

    const handleChange = (e) => {
        setCursorPos(e.target.selectionStart);
        onChange(e);
    };

    const insertAtCursor = (text) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = value.substring(0, start);
        const after = value.substring(end);
        const newValue = before + text + after;
        onChange({ target: { value: newValue } });
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const wrapSelection = (before, after = before) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end);
        const beforeText = value.substring(0, start);
        const afterText = value.substring(end);
        const newValue = beforeText + before + selected + after + afterText;
        onChange({ target: { value: newValue } });
        setTimeout(() => {
            textarea.focus();
            if (selected) {
                textarea.setSelectionRange(start + before.length, end + before.length);
            } else {
                textarea.setSelectionRange(start + before.length, start + before.length);
            }
        }, 0);
    };

    const formatBold = () => wrapSelection('<strong>', '</strong>');
    const formatItalic = () => wrapSelection('<em>', '</em>');
    const formatList = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end);
        const before = value.substring(0, start);
        const after = value.substring(end);
        
        if (selected) {
            // Convert selected lines to list items
            const lines = selected.split('\n').filter(l => l.trim());
            const listItems = lines.map(l => `<li>${l.trim()}</li>`).join('\n');
            const newValue = before + '<ul>\n' + listItems + '\n</ul>' + after;
            onChange({ target: { value: newValue } });
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + '<ul>\n'.length + listItems.length, start + '<ul>\n'.length + listItems.length);
            }, 0);
        } else {
            // Insert a new list item at cursor
            const lineStart = before.lastIndexOf('\n') + 1;
            const lineEnd = after.indexOf('\n') === -1 ? after.length : after.indexOf('\n');
            const currentLine = before.substring(lineStart) + after.substring(0, lineEnd);
            
            if (currentLine.trim().startsWith('<li>')) {
                // Already a list item, add another
                insertAtCursor('\n<li></li>');
            } else {
                // New list
                insertAtCursor('<ul>\n<li></li>\n</ul>');
            }
        }
    };

    return (
        <div className="border rounded">
            <div className="flex gap-1 p-2 border-b bg-gray-50">
                <button type="button" onClick={formatBold} className="px-2 py-1 border rounded hover:bg-gray-200" title="Bold">
                    <strong>B</strong>
                </button>
                <button type="button" onClick={formatItalic} className="px-2 py-1 border rounded hover:bg-gray-200" title="Italic">
                    <em>I</em>
                </button>
                <button type="button" onClick={() => insertAtCursor('\n')} className="px-2 py-1 border rounded hover:bg-gray-200" title="Line Break">
                    ↵
                </button>
                <button type="button" onClick={formatList} className="px-2 py-1 border rounded hover:bg-gray-200" title="Bullet List">
                    • List
                </button>
            </div>
            <textarea
                ref={textareaRef}
                className="w-full p-2 min-h-[200px] font-mono resize-y"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onSelect={(e) => setCursorPos(e.target.selectionStart)}
            />
        </div>
    );
}

