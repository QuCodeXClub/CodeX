import React from "react";
import { ShieldCheck, Edit, Trash2, Image as ImageIcon } from "lucide-react";

export const TeamMemberCard = ({
  member,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow w-full">
      {/* Photo Section */}
      <div className="h-56 w-full bg-slate-100 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-slate-300" />
        )}
        {/* Year Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-slate-100 flex items-center">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
            {member.academicYear}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col items-center text-center">
        <h3
          className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 w-full"
          title={member.name}
        >
          {member.name}
        </h3>

        <div className="flex items-center justify-center gap-1.5 text-teal-600 text-sm font-semibold mb-1 w-full">
          <ShieldCheck className="w-4 h-4 shrink-0" />{" "}
          <span className="line-clamp-1">{member.post}</span>
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100 w-full">
            <button
              onClick={() => onEdit && onEdit(member)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-teal-200"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(member._id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
