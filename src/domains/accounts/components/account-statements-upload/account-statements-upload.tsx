import { Surface } from '@/domains/global/components/surface';
import { UploadProcess } from './upload-process';
import { TransactionsRefinementProcess } from './transactions-refinement-process';
import { useQuery } from '@tanstack/react-query';
import type { I_ParsedAccountStatement } from '@/domains/accounts/api';
import { GET_UPLOADED_STATEMENT_QUERY_KEY } from '@/domains/accounts/api/keys';

interface AccountStatementsUploadProps {
  accountId: string;
}

export const AccountStatementsUpload = ({ accountId }: AccountStatementsUploadProps) => {
  const { data: statement } = useQuery<I_ParsedAccountStatement>({
    queryKey: GET_UPLOADED_STATEMENT_QUERY_KEY(accountId),
    enabled: false, // Don't fetch, just read from cache
  });

  return (
    <div className="flex-1" data-ui="account-statements-upload">
      <div className="space-y-4">
        <UploadProcess accountId={accountId} />
        {statement && <TransactionsRefinementProcess statement={statement} />}
      </div>
    </div>
  );
};
