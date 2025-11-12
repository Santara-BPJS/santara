import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";

type BotConfigurationProps = {
  autoReplyTemplate: string;
  botBehavior: string;
  collectFromGroups: boolean;
  onAutoReplyChange: (value: string) => void;
  onBotBehaviorChange: (value: string) => void;
  onCollectFromGroupsChange: (value: boolean) => void;
  onSave: () => void;
};

export function BotConfiguration({
  autoReplyTemplate,
  botBehavior,
  collectFromGroups,
  onAutoReplyChange,
  onBotBehaviorChange,
  onCollectFromGroupsChange,
  onSave,
}: BotConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Konfigurasi Bot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="auto-reply">Template Balasan Otomatis</Label>
          <Textarea
            className="resize-none"
            id="auto-reply"
            onChange={(e) => onAutoReplyChange(e.target.value)}
            rows={4}
            value={autoReplyTemplate}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bot-behavior">Aturan Perilaku Bot</Label>
          <Select onValueChange={onBotBehaviorChange} value={botBehavior}>
            <SelectTrigger id="bot-behavior">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="always">Jawab di setiap pertanyaan</SelectItem>
              <SelectItem value="mention">Jawab hanya jika disebut</SelectItem>
              <SelectItem value="silent">Diam tapi catat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted p-4">
          <Label className="cursor-pointer" htmlFor="collect-groups">
            Aktifkan Pengumpulan Pengetahuan dari Grup
          </Label>
          <Switch
            checked={collectFromGroups}
            id="collect-groups"
            onCheckedChange={onCollectFromGroupsChange}
          />
        </div>

        <Button className="w-full" onClick={onSave} size="lg">
          Simpan Konfigurasi
        </Button>
      </CardContent>
    </Card>
  );
}
