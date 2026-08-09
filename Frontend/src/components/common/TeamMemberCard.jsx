import React from "react";
import { ShieldCheck, Edit, Trash2, Image as ImageIcon } from "lucide-react";

export const TeamMemberCard = ({
  member,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Photo Section */}
      <div className="h-60 w-full bg-card-hover relative overflow-hidden flex items-center justify-center border-b border-border/60">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <ImageIcon className="w-10 h-10 opacity-40" />
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">No Photo</span>
          </div>
        )}

        {/* Academic Year Badge */}
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border/80 shadow-sm flex items-center">
          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">
            {member.academicYear}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col items-center text-center">
        <h3
          className="font-display font-bold text-lg text-text mb-1 line-clamp-1 w-full uppercase tracking-wide group-hover:text-accent transition-colors"
          title={member.name}
        >
          {member.name}
        </h3>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{member.post}</span>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2 mt-auto pt-4 border-t border-border/60 w-full">
            <button
              onClick={() => onEdit && onEdit(member)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-card-hover hover:bg-accent/10 text-text-muted hover:text-accent rounded-xl text-xs font-mono font-semibold transition-colors border border-border/80"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(member._id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-card-hover hover:bg-danger/10 text-text-muted hover:text-danger rounded-xl text-xs font-mono font-semibold transition-colors border border-border/80"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
