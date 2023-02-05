import { useEffect, useState } from "react";

interface ProductCommentCardProps {
  userComment: string;
  userRate: number;
  userRatedAt: string;
  userEmail: string;
}

export default function ProductCommentCard({
  userComment,
  userRate,
  userRatedAt,
  userEmail,
}: ProductCommentCardProps) {
  const [userRateDate, setUserRateDate] = useState(userRatedAt);

  useEffect(() => {
    const newUserRateDate = new Date(userRatedAt).toLocaleString();
    setUserRateDate(newUserRateDate);
  }, []);

  return (
    <div className="w-full border border-secondary--orange rounded-[30px]">
      <div className="w-full p-4 flex flex-col justify-center items-center border-b border-b-secondary--orange rounded-t-[30px]">
        <div className="flex justify-between items-center gap-x-6">
          <p className="paragraph text-primary--orange font-medium">{userEmail}</p>
          <p className="paragraph text-primary--blue font-medium">
            {userRate}/10
          </p>
        </div>
        <p className="paragraph text-secondary--gray">{userRateDate}</p>
      </div>
      <div className="w-full p-4 text-center">
        <p className="paragraph text-primary--blue italic">{userComment}</p>
      </div>
    </div>
  );
}
