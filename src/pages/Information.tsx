import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const Information = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="p-4 pb-20 space-y-6">
        <h1 className="text-xl font-bold text-center">{t('information')}</h1>

        <Accordion type="single" collapsible className="space-y-4">
          <Card>
            <AccordionItem value="instructions">
              <CardHeader>
                <AccordionTrigger className="text-left">
                  <CardTitle>{t('appInstructions')}</CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p><strong>1. Report Disease:</strong> Select animal or crop, describe symptoms, and add relevant details.</p>
                    <p><strong>2. View Reports:</strong> Check status of your submitted reports and any responses from experts.</p>
                    <p><strong>3. Ask Questions:</strong> Submit queries about farming practices, disease management, or certification.</p>
                    <p><strong>4. Offline Mode:</strong> App works offline - data syncs when connection returns.</p>
                    <p><strong>5. Language:</strong> Switch between English, Hindi, and Kannada using the language selector.</p>
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="certification">
              <CardHeader>
                <AccordionTrigger className="text-left">
                  <CardTitle>{t('certificationInfo')}</CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p><strong>Maximum Residue Limits (MRL):</strong> Legal limits for pesticide/medicine residues in food products.</p>
                    <p><strong>Compliance:</strong> Essential for food safety and export eligibility.</p>
                    <p><strong>Withdrawal Period:</strong> Time between last treatment and harvest/consumption.</p>
                    <p><strong>Documentation:</strong> Keep records of all treatments for certification purposes.</p>
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="amu">
              <CardHeader>
                <AccordionTrigger className="text-left">
                  <CardTitle>{t('amuGuidelines')}</CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p><strong>Responsible Use:</strong> Use antimicrobials only when necessary and as prescribed.</p>
                    <p><strong>Complete Course:</strong> Always complete the full treatment course even if symptoms improve.</p>
                    <p><strong>Prevent Resistance:</strong> Proper use prevents development of resistant bacteria.</p>
                    <p><strong>Veterinary Guidance:</strong> Consult qualified veterinarians for treatment decisions.</p>
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Card>
        </Accordion>
      </div>
    </Layout>
  );
};