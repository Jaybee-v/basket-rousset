import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

interface AbsentsCardView {
  absents: User[];
}

export const AbsentsCardView = ({ absents }: AbsentsCardView) => {
  return (
    <article className="flex flex-col gap-2 border border-amber-600 rounded-lg p-2 bg-amber-50 z-50">
      <h3 className="text-amber-600 font-bold text-xs uppercase">Absents</h3>
      {absents.map((a) => (
        <section
          key={`participant-${a.id}`}
          className="flex items-center gap-2"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>{a.name}</p>
        </section>
      ))}
    </article>
  );
};
