package panicathe.server.walk;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*") // 개발 테스트용 전체 허용
public class WalkSessionController {
    private final WalkSessionRepository repo;

    public WalkSessionController(WalkSessionRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        WalkSession s = new WalkSession();
        s.setStartedAt(Instant.now());

        // 좌표 저장 (Number 타입 변환)
        if (body.get("startLat") != null) {
            s.setStartLat(Double.valueOf(body.get("startLat").toString()));
        }
        if (body.get("startLng") != null) {
            s.setStartLng(Double.valueOf(body.get("startLng").toString()));
        }
        if (body.get("destLat") != null) {
            s.setDestLat(Double.valueOf(body.get("destLat").toString()));
        }
        if (body.get("destLng") != null) {
            s.setDestLng(Double.valueOf(body.get("destLng").toString()));
        }

        s = repo.save(s);
        return Map.of(
                "id", s.getId(),
                "startedAt", s.getStartedAt(),
                "startLat", s.getStartLat(),
                "startLng", s.getStartLng(),
                "destLat", s.getDestLat(),
                "destLng", s.getDestLng()
        );
    }



    @PostMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return repo.findById(id).map(s -> {
            s.setEndedAt(Instant.now());
            s.setDistanceKm(((Number) body.getOrDefault("distanceKm", 0)).doubleValue());
            s.setCo2SavedKg(((Number) body.getOrDefault("co2SavedKg", 0)).doubleValue());
            if (body.containsKey("pathGeoJson")) {
                s.setPathGeoJson((String) body.get("pathGeoJson"));
            }
            repo.save(s);
            return ResponseEntity.ok(Map.of("ok", true));
        }).orElse(ResponseEntity.notFound().build());
    }


    @GetMapping
    public List<WalkSession> list() {
        return repo.findAll();
    }
}
