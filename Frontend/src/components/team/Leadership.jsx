import React from "react";
import { Building, Monitor, Users, BookOpen, Star } from "lucide-react";
import leadershipData from "../../data/leadership.json";

const IconMap = {
  Building: Building,
  Monitor: Monitor,
  Users: Users,
  BookOpen: BookOpen,
};
const LeadershipCard = ({ member }) => {
  return (
    <div className="flex items-center gap-4 bg-card-hover/40 border border-border/40 rounded-xl p-3 hover:border-accent/30 hover:bg-card-hover transition-colors">
      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border/80">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-display font-bold text-sm text-text truncate">
            {member.name}
          </h4>
          {member.starred && (
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
          )}
        </div>
        <span className="text-xs text-text-muted font-mono truncate">
          {member.role}
        </span>
      </div>
    </div>
  );
};
const LeadershipSection = ({ section, className = "" }) => {
  const Icon = IconMap[section.icon] || Users;
  return (
    <div
      className={`glass-card rounded-2xl p-6 border border-border/60 shadow-sm relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-text mb-1">
              {section.title}
            </h3>
            <p className="text-sm text-text-muted">{section.subtitle}</p>
          </div>
        </div>
        <div className="inline-flex">
          <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
            {section.tag}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.members.map((member) => (
          <LeadershipCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

const Leadership = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <LeadershipSection section={leadershipData.universityLeadership} />
      <LeadershipSection section={leadershipData.computerApplications} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadershipSection section={leadershipData.clubLeadership} className="h-full" />
        <LeadershipSection section={leadershipData.facultyMentors} className="h-full" />
      </div>
    </div>
  );
};

export default Leadership;
