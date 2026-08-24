import React from 'react';
import { db, AuditLogEntry } from '../../services/db';
import { Clock, ShieldCheck, User } from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const logs = db.getAuditLogs();

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div className="admin-card-title">Nhật Ký Thao Tác & Quản Trị Hệ Thống (Audit Log)</div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Thời Gian</th>
            <th>Người Thực Hiện</th>
            <th>Hành Động</th>
            <th>Đối Tượng / Chi Tiết</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                Chưa có nhật ký hoạt động nào được lưu trữ.
              </td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{log.timestamp}</td>
                <td>
                  <span style={{ fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} /> {log.user}
                  </span>
                </td>
                <td>
                  <span className="badge badge-primary">{log.action}</span>
                </td>
                <td style={{ color: '#ffffff', fontWeight: 600 }}>{log.target}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
