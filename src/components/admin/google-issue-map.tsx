"use client";

import { format } from 'date-fns';
import { Issue } from '@/types/issue';
import { Badge } from '@/components/ui/badge';

interface GoogleIssueMapProps {
  issues: Issue[];
}

const GoogleIssueMap: React.FC<GoogleIssueMapProps> = ({ issues }) => {
  const validIssues = issues.filter(issue => typeof issue.location.latitude === 'number' && typeof issue.location.longitude === 'number');
  const issue = validIssues[0]; // Get the first valid issue for display

  return (
    <div className="p-4 rounded-lg border">
      {issue ? (
        <div>
          <h3 className="font-semibold text-lg">{issue.title}</h3>
          <div className="flex gap-2 my-2">
            <Badge variant="outline">{issue.type}</Badge>
            <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'default' : 'secondary'}>
              {issue.priority} Priority
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{issue.location.address || 'Address not available'}</p>
          <p className="text-xs text-muted-foreground">Reported: {format(new Date(issue.reportedAt), 'MMM d, yyyy')}</p>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No issues available to display on the map.</p>
      )}
    </div>
  );
};

export default GoogleIssueMap;
