import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendEventEmail, testSendEventEmail } from "../../api/notificationApi";
import toast from "react-hot-toast";
import RichTextEditor from "../../components/RichTextEditor";

export default function NotifyEvent() {
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState({ subject: "", message: "" });

    async function onSubmit(e) {
        e.preventDefault();
        if (!form.subject.trim()) {
            toast.error('Subject is required');
            return;
        }
        if (!form.message.trim()) {
            toast.error('Message body is required');
            return;
        }
        
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="mb-2">Send this email to all opted-in students?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(true); }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(false); }}
                            className="px-3 py-1 bg-gray-300 rounded text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
        
        if (!confirmed) return;
        
        const promise = sendEventEmail(id, form).then(({ data }) => {
            const msg = `Sent: ${data.sent} / ${data.attempted}${data.failed > 0 ? ` (${data.failed} failed)` : ''}`;
            setTimeout(() => nav("/coordinator/dashboard"), 1500);
            return msg;
        });
        
        toast.promise(promise, {
            loading: 'Sending emails...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Failed to send emails",
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => nav("/coordinator/myevents")} className="px-3 py-1 border rounded hover:bg-gray-100">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold">Notify Participants (Email)</h1>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <input className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Subject"
                            value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                        <RichTextEditor
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Message (HTML allowed). Use toolbar for formatting. Placeholders: {{name}}, {{event.title}}, {{event.date}}, etc."
                        />
                        <div className="text-sm text-gray-600">
                            <strong>Placeholders:</strong> {'{{name}}'}, {'{{email}}'}, {'{{event.title}}'}, {'{{event.date}}'}, {'{{event.venue}}'}, {'{{event.category}}'}, {'{{coordinator.name}}'}, {'{{coordinator.email}}'}, {'{{coordinator.mobile}}'}
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" type="submit">Send Email</button>
                            <button type="button" onClick={() => nav(-1)} className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                    </form>
                    <Preview raw={form.message} />
                    <div className="mt-6 border-t pt-4">
                        <h2 className="font-semibold mb-2">Test Send</h2>
                        <TestSend id={id} source={form} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function TestSend({ id, source }) {
    const [to, setTo] = useState("");
    const [busy, setBusy] = useState(false);
    async function onTest() {
        if (!to) {
            toast.error('Enter a test recipient address');
            return;
        }
        setBusy(true);
        const promise = testSendEventEmail(id, { to, subject: source.subject, message: source.message })
            .then(() => `Test email sent to ${to}`);
        toast.promise(promise, {
            loading: 'Sending test email...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || 'Test send failed',
        }).finally(() => setBusy(false));
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



