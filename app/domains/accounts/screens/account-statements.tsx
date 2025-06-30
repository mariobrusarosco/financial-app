import { Button } from '@/domains/ui-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Upload, FileText } from 'lucide-react';
import React, { useRef, useState } from 'react';

export const AccountStatementsScreen = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Statement Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Statement
          </CardTitle>
          <CardDescription>
            Upload PDF statements to automatically parse transactions and calculate balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleButtonClick}
              className="w-full h-24 border-2 border-dashed border-border hover:border-primary/50 bg-background"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="font-medium">Click to upload PDF statement</span>
                <span className="text-sm text-muted-foreground">Supports PDF files up to 10MB</span>
              </div>
            </Button>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Selected file: {selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statements History */}
      <Card>
        <CardHeader>
          <CardTitle>Statement History</CardTitle>
          <CardDescription>Previously uploaded statements for this account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No statements uploaded yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first statement to start tracking your account history
            </p>
            <Button onClick={handleButtonClick} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Statement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
