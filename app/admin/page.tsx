import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GeneratePeriod from "./generatePeriod";
import DataContainer from "./dataContainer";


function AdminPage() {


  return (
    <div style={{ padding: '20px' }}>
      <h1>
        Admin Dashboard
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>
            Skift
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GeneratePeriod />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Jobbade pass
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataContainer />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;