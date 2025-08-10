// WalkSession.java
package panicathe.server.walk;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.ZonedDateTime;

@Entity
@Data
public class WalkSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant startedAt;
    private Instant endedAt;
    private Double distanceKm;
    private Double co2SavedKg;

    @Lob
    private String pathGeoJson;

    // ✅ 추가 필드
    private Double startLat;
    private Double startLng;
    private Double destLat;
    private Double destLng;
    // getters, setters
}
