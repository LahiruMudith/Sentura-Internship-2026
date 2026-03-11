package lk.sentura.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CountryDTO {
    private String name;
    private String capital;
    private String region;
    private long population;
    private String flag;
}
