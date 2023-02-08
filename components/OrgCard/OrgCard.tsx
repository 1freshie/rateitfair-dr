import Link from "next/link";
import { useEffect, useState } from "react";

interface OrgCardProps {
  orgId: string;
  orgName: string;
  orgLogoURL: string;
  orgProductsCount: number;
  orgUsersCount: number;
}

export default function OrgCard({
  orgId,
  orgName,
  orgLogoURL,
  orgProductsCount,
  orgUsersCount,
}: OrgCardProps) {
  const [convertedUserOrgName, setConvertedUserOrgName] = useState("");

  useEffect(() => {
    if (orgName) {
      const convertedOrgName = orgName.toLowerCase().replace(/\s/g, "");

      setConvertedUserOrgName(convertedOrgName);
    }
  }, []);

  // TODO: Add org logo and update the org data with the things in AddOrganizationForm.tsx

  return (
    <Link href={`/orgs/${convertedUserOrgName}`}>
      <div className="w-full flex flex-col justify-center items-center border border-secondary--orange duration-300 hover:border-primary--orange rounded-2xl">
        <div className="w-full p-4 flex justify-center items-center border-b border-b-secondary--orange rounded-t-[30px]">
          <h1 className="heading text-center">{orgName}</h1>
        </div>
        <div className="w-full p-4 flex justify-center items-center gap-x-8">
          <div className="w-full p-4 flex flex-col justify-center items-center">
            <h1 className="paragraph text-center">Users</h1>
            <p className="paragraph text-secondary--gray font-medium text-center">
              {orgUsersCount}
            </p>
          </div>
          <div className="w-full p-4 flex flex-col justify-center items-center">
            <h1 className="paragraph text-center">Products</h1>
            <p className="paragraph text-secondary--gray font-medium text-center">
              {orgProductsCount}
            </p>
          </div>
        </div>
        <div className="w-full p-4 flex justify-center items-center">
          <button className="duration-300 button-orange">To org</button>
        </div>
      </div>
    </Link>
  );
}
