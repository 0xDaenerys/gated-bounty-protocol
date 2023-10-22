import { Layout } from "../../components/Layout";
import { useAccount, useWalletClient } from "wagmi";
import { useMemo, useState } from "react";
import { ENV, SpacesUI, SpacesUIProvider } from "@pushprotocol/uiweb";
import { ISpacesTheme } from "@pushprotocol/uiweb/lib/components/space/theme";

export const SpacesPage = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [spaceId, setSpaceId] = useState<string>('');

    const darkTheme: ISpacesTheme = {
        titleBg: 'linear-gradient(45deg, #E165EC 0.01%, #A483ED 100%)',
        titleTextColor: '#fff',
        bgColorPrimary: '#2F3137',
        bgColorSecondary: '#404550',
        textColorPrimary: '#fff',
        textColorSecondary: '#B6BCD6',
        textGradient: 'linear-gradient(45deg, #B6A0F5 0%, #F46EF6 57.29%, #FF95D5 100%)',
        btnColorPrimary: '#D53A94',
        btnOutline: '#D53A94',
        borderColor: '#2F3137',
        borderRadius: '17px',
        containerBorderRadius: '12px',
        statusColorError: '#E93636',
        statusColorSuccess: '#30CC8B',
        iconColorPrimary: '#787E99',
    };

  const spaceUI = useMemo(() => {
        if (address && walletClient)
            return new SpacesUI({
            account: address,
            signer: walletClient,
            pgpPrivateKey: '',
            env: ENV.STAGING,
        });
    }, [address, walletClient]);

  return (
    <Layout>
        {!spaceUI ? (
            // Show a loader while loading
            <div className="flex justify-center items-center h-[80vh]">
            <span className="h-10 animate-bounce text-5xl font-bold">Loading...</span>
            </div>
        ) :
            
                <SpacesUIProvider spaceUI={spaceUI || ""} theme={darkTheme}>
                    <div className="flex flex-col gap-10 mt-10">
                        <div className="flex gap-5">
                            <spaceUI.SpaceCreationButtonWidget>
                            <button className="h-full py-3 bg-[#D53A94] text-white px-5 rounded-xl">Create your Space</button>
                            </spaceUI.SpaceCreationButtonWidget>
                            <spaceUI.SpaceInvites>
                                <button className="h-full py-3 bg-[#D53A94] text-white px-5 rounded-xl">Space Invites</button>
                            </spaceUI.SpaceInvites>
                        </div>
                        <div className="h-[600px] rounded-lg overflow-scroll">
                            <spaceUI.SpaceFeed onBannerClickHandler={(spaceId: string) => {
                                setSpaceId(spaceId)
                            }} />
                        </div>
                        <spaceUI.SpaceWidget spaceId={spaceId} />
                    </div>
                </SpacesUIProvider>
        } 
    </Layout>
  );
};
