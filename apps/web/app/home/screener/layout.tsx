import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageHeader } from '@kit/ui/page';

import { HeaderSwitchers } from '~/components/header-switchers';
import { withI18n } from '~/lib/i18n/with-i18n';

function MarketLayout(props: React.PropsWithChildren) {
  return (
    <>
      <PageHeader description={<AppBreadcrumbs />}>
        <HeaderSwitchers />
      </PageHeader>

      {props.children}
    </>
  );
}

export default withI18n(MarketLayout);
