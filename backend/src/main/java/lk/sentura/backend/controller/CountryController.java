package lk.sentura.backend.controller;

import jakarta.annotation.PostConstruct;
import lk.sentura.backend.dto.CountryDTO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/countries")
@CrossOrigin(origins = "*")
public class CountryController {

    private List<CountryDTO> countryCache = new ArrayList<>();

    @PostConstruct
    @Scheduled(fixedRate = 600000)
    public void fetchCountries() {
        System.out.println("Refreshing Country Cache...");
        String url = "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags";
        RestTemplate restTemplate = new RestTemplate();

        try {
            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);
            if (response != null) {
                this.countryCache = response.stream().map(data -> {
                    Map<String, Object> nameObj = (Map<String, Object>) data.get("name");
                    List<String> capitals = (List<String>) data.get("capital");
                    Map<String, String> flags = (Map<String, String>) data.get("flags");

                    return new CountryDTO(
                            (String) nameObj.get("common"),
                            capitals != null && !capitals.isEmpty() ? capitals.get(0) : "N/A",
                            (String) data.get("region"),
                            Long.valueOf(data.get("population").toString()),
                            flags != null ? flags.get("png") : ""
                    );
                }).collect(Collectors.toList());
            }
        } catch (Exception e) {
            System.err.println("Error fetching countries: " + e.getMessage());
        }
    }

    @GetMapping
    public List<CountryDTO> getAll() {
        return countryCache;
    }

    @GetMapping("/search")
    public List<CountryDTO> search(@RequestParam String query) {
        return countryCache.stream()
                .filter(c -> c.getName().toLowerCase().contains(query.toLowerCase()) ||
                        c.getRegion().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }
}