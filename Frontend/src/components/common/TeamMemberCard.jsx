import React, { useState } from "react";
import { ShieldCheck, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import ImageLightboxModal from "./ImageLightboxModal";

export const TeamMemberCard = ({
  member,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
   <div className="bg-card/10 hover:bg-card/20 transition-all duration-300 backdrop-blur-md rounded-2xl p-3 sm:p-5 flex flex-col items-center group h-full relative border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      {/* Academic Year Badge */}
      {member.academicYear && (
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-md px-2 py-0.5 rounded border border-border/80 shadow-sm flex items-center z-10">
          <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider">
            {member.academicYear}
          </span>
        </div>
      )}

      {/* Circular Photo Section */}
      <div 
        className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-3 sm:mb-4 md:mb-5 border-[3px] border-card bg-card-hover shadow-md shrink-0 flex items-center justify-center relative z-0 ring-2 ring-border group-hover:ring-accent/40 transition-all duration-300 ${member.photo ? 'cursor-pointer' : ''}`}
        onClick={() => { if (member.photo) setIsModalOpen(true); }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-text-muted">
            <ImageIcon className="w-8 h-8 md:w-10 md:h-10 opacity-40" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col items-center text-center w-full">
        <h3
          className="font-display font-bold text-sm sm:text-[15px] md:text-base lg:text-lg text-text mb-1 sm:mb-1.5 md:mb-2 line-clamp-1 w-full tracking-wide group-hover:text-accent transition-colors"
          title={member.name}
        >
          {member.name}
        </h3>

        <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-mono font-semibold mb-2 h-auto text-center w-full max-w-full transition-all">
          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 shrink-0" />
          <span className="whitespace-normal leading-tight">{member.post}</span>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2 mt-auto pt-4 border-t border-border/60 w-full">
            <button
              onClick={() => onEdit && onEdit(member)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-card-hover hover:bg-accent/10 text-text-muted hover:text-accent rounded-lg text-[10px] font-mono font-semibold transition-colors border border-border/80"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(member._id)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-card-hover hover:bg-danger/10 text-text-muted hover:text-danger rounded-lg text-[10px] font-mono font-semibold transition-colors border border-border/80"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {member.photo && (
        <ImageLightboxModal
          isOpen={isModalOpen}
          image={{ src: member.photo, alt: member.name }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
