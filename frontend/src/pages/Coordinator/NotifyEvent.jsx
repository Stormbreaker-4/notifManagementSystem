import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendEventEmail, testSendEventEmail } from "../../api/notificationApi";

export default function NotifyEvent() {
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState({ subject: "", message: "" });
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr(""); setOk("");
        if (!window.confirm("Send this email to all opted-in students?")) return;
        try {
            const { data } = await sendEventEmail(id, form);
            alert(`Email Summary\nAttempted: ${data.attempted}\nSent: ${data.sent}\nFailed: ${data.failed}${data.skipped ? `\nSkipped (no email): ${data.skipped}` : ''}`);
            setOk(`Sent: ${data.sent} / ${data.attempted}`);
        } catch (e2) {
            alert(e2?.response?.data?.message || "Failed to send emails");
            setErr(e2?.response?.data?.message || "Failed to send emails");
        }
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Notify Participants (Email)</h1>
            {err && <p className="text-red-600 mb-2">{err}</p>}
            {ok && <p className="text-green-600 mb-2">{ok}</p>}
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input className="border p-2" placeholder="Subject"
                    value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <Toolbar value={form.message} onChange={(val)=>setForm({...form, message: val})} />
                <textarea className="border p-2 min-h-[200px] font-mono" placeholder="Message (HTML allowed)"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <div className="flex gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send Email</button>
                    <button type="button" onClick={() => nav(-1)} className="px-4 py-2 rounded border">Cancel</button>
                </div>
            </form>
            <Preview raw={form.message} />
            <div className="mt-6 border-t pt-4">
                <h2 className="font-semibold mb-2">Test Send</h2>
                <TestSend id={id} source={form} />
            </div>
        </div>
    );
}

function TestSend({ id, source }) {
    const [to, setTo] = useState("");
    const [busy, setBusy] = useState(false);
    async function onTest() {
        if (!to) return alert('Enter a test recipient address');
        setBusy(true);
        try {
            const { data } = await testSendEventEmail(id, { to, subject: source.subject, message: source.message });
            alert(`Test Email Sent\nSent: ${data.sent}`);
        } catch (e) {
            alert(e?.response?.data?.message || 'Test send failed');
        } finally { setBusy(false); }
    }
    return (
        <div className="flex items-center gap-2">
            <input className="border p-2 flex-1" placeholder="youraddress@example.com" value={to} onChange={(e)=>setTo(e.target.value)} />
            <button className="bg-gray-800 text-white px-3 py-2 rounded" onClick={onTest} disabled={busy}>{busy ? 'Sending…' : 'Send Test'}</button>
        </div>
    );
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderClientPreview(raw) {
    const msg = String(raw || '');
    const looksHtml = msg.includes('<');
    if (looksHtml) return msg;
    return escapeHtml(msg).replace(/\n/g, '<br/>');
}

function Preview({ raw }) {
    const html = renderClientPreview(raw);
    if (!raw) return null;
    return (
        <div className="mt-6">
            <h2 className="font-semibold mb-2">Preview</h2>
            <div className="border rounded p-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}

function Toolbar({ value, onChange }) {
    function wrap(tagOpen, tagClose = '') {
        const sel = window.getSelection ? String(window.getSelection()) : '';
        if (sel) {
            onChange(value.replace(sel, `${tagOpen}${sel}${tagClose || tagOpen.replace('<','</')}`));
        } else {
            onChange((value || '') + `${tagOpen}${tagClose || tagOpen.replace('<','</')}`);
        }
    }
    function insert(item) {
        onChange((value || '') + item);
    }
    return (
        <div className="flex flex-wrap gap-2 text-sm">
            <button type="button" className="px-2 py-1 border rounded" onClick={()=>wrap('<b>','</b>')}>Bold</button>
            <button type="button" className="px-2 py-1 border rounded" onClick={()=>wrap('<i>','</i>')}>Italic</button>
            <button type="button" className="px-2 py-1 border rounded" onClick={()=>insert('<br/>')}>Line Break</button>
            <button type="button" className="px-2 py-1 border rounded" onClick={()=>insert('<ul>\n<li></li>\n</ul>')}>List</button>
            <button type="button" className="px-2 py-1 border rounded" onClick={()=>insert('<a href=\"https://\">link</a>')}>Link</button>
            <div className="ml-auto text-gray-500">
                Placeholders: {'{{name}}'}, {'{{event.title}}'}, {'{{event.date}}'}
            </div>
        </div>
    );
}


