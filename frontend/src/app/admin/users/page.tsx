'use client';

import { useAuth } from '../../../hooks/useAuth';
import { useToastStore } from '../../../store/toastStore';
import { USER_TIER_COLOR, USER_TIER_TEXT } from '../../../constants';
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function AdminUsersPage() {
  const { users, updateUser, isLoadingUsers } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  const [search, setSearch] = useState('');

  const handleToggleBlock = async (id: number, email: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await updateUser({ id, user: { status: nextStatus as any } });
      addToast(
        nextStatus === 'BLOCKED'
          ? `Đã khóa tài khoản thành công: ${email}`
          : `Đã mở khóa tài khoản: ${email}`,
        'info'
      );
    } catch (err) {
      addToast('Lỗi khi cập nhật trạng thái người dùng!', 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-black uppercase tracking-tight">Quản Lý Thành Viên & Phân Quyền</h1>
        <p className="text-xs text-foreground-muted">Kiểm tra thông tin chi tiết tài khoản, khóa hoặc mở khóa quyền truy cập của khách hàng</p>
      </div>

      {/* Filter search bar */}
      <div className="relative max-w-sm w-full">
        <input
          type="text"
          placeholder="Tìm tên thành viên, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 bg-background-card border border-border text-foreground rounded-custom px-3 pr-8 text-xs font-semibold placeholder:text-foreground-muted outline-none focus:border-accent"
        />
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
      </div>

      {/* Table view */}
      {isLoadingUsers ? (
        <p className="text-xs text-foreground-muted py-6">Đang tải danh sách người dùng...</p>
      ) : (
        <div className="bg-background-card border border-border rounded-custom overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-foreground-muted font-bold text-[10px] uppercase tracking-wider bg-zinc-900/50">
                  <th className="p-3">Thành viên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Số điện thoại</th>
                  <th className="p-3">Hạng thành viên</th>
                  <th className="p-3">Vai trò</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Khóa / Mở khóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUsers.map((u) => {
                  const isBlocked = u.status === 'BLOCKED';
                  return (
                    <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3 flex items-center gap-2.5">
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${u.email}`}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full bg-zinc-900 border border-border"
                        />
                        <span className="font-bold text-foreground">{u.fullName}</span>
                      </td>
                      <td className="p-3 font-semibold text-foreground-muted">{u.email}</td>
                      <td className="p-3 text-foreground-muted">{u.phone || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 border rounded-sm ${USER_TIER_COLOR[u.tier]}`}>
                          {USER_TIER_TEXT[u.tier]}
                        </span>
                      </td>
                      <td className="p-3 text-foreground-muted font-mono">{u.role}</td>
                      <td className="p-3">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-sm ${
                          isBlocked ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'ROLE_ADMIN' ? (
                          <button
                            onClick={() => handleToggleBlock(u.id, u.email, u.status)}
                            className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto border cursor-pointer ${
                              isBlocked
                                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500'
                                : 'bg-red-500/10 border-red-500/30 text-accent hover:bg-accent hover:text-white hover:border-accent'
                            }`}
                          >
                            {isBlocked ? (
                              <>
                                <ShieldCheck size={12} /> Kích hoạt
                              </>
                            ) : (
                              <>
                                <ShieldAlert size={12} /> Khóa
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[10px] text-foreground-muted italic">Bảo vệ hệ thống</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
