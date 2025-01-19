import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

interface ParticipantsCardView {
  participants: User[];
}

export const ParticipantsCardView = ({
  participants,
}: ParticipantsCardView) => {
  return (
    <article className="flex flex-col gap-2 border border-green-600 rounded-lg p-2 bg-green-50 z-50">
      <h3 className="text-green-600 font-bold text-xs uppercase">
        Participants
      </h3>
      {participants.map((p) => (
        <section
          key={`participant-${p.id}`}
          className="flex items-center gap-2"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>{p.name}</p>
        </section>
      ))}
    </article>
  );
};
